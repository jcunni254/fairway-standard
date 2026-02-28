import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

export const maxDuration = 300;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("interviews")
    .select("id, interviewee_name, interviewee_role, status, duration_seconds, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get("audio") as File | null;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const notes = formData.get("notes") as string | null;

  if (!file || !name || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!["caddie", "instructor"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const supabase = getSupabase();

  const { data: interview, error: insertError } = await supabase
    .from("interviews")
    .insert({
      interviewee_name: name,
      interviewee_role: role,
      interviewer_notes: notes || null,
      status: "uploading",
    })
    .select("id")
    .single();

  if (insertError || !interview) {
    return NextResponse.json({ error: "Failed to create interview record" }, { status: 500 });
  }

  const ext = file.name.split(".").pop() || "m4a";
  const storagePath = `${interview.id}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("interview-recordings")
    .upload(storagePath, arrayBuffer, {
      contentType: file.type || "audio/mp4",
      upsert: true,
    });

  if (uploadError) {
    await supabase.from("interviews").update({ status: "failed" }).eq("id", interview.id);
    return NextResponse.json({ error: "Upload failed: " + uploadError.message }, { status: 500 });
  }

  await supabase
    .from("interviews")
    .update({ audio_url: storagePath, status: "transcribing" })
    .eq("id", interview.id);

  try {
    if (!process.env.OPENAI_API_KEY) {
      await supabase.from("interviews").update({ status: "failed" }).eq("id", interview.id);
      return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const audioFile = new File([arrayBuffer], file.name, { type: file.type || "audio/mp4" });

    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: audioFile,
      response_format: "text",
    });

    await supabase
      .from("interviews")
      .update({
        transcript: transcription,
        status: "completed",
      })
      .eq("id", interview.id);

    return NextResponse.json({
      id: interview.id,
      status: "completed",
      message: "Interview uploaded and transcribed successfully",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Transcription failed";
    await supabase
      .from("interviews")
      .update({ status: "failed" })
      .eq("id", interview.id);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
