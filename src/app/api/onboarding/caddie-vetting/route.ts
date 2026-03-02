import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const VALID_EXPERIENCE = ["none", "casual", "1-3_years", "3+_years"];
const VALID_CLUB = ["land_short", "club_up", "hard_7", "ask_golfer"];
const VALID_ETIQUETTE = ["walk_away", "rake_properly", "leave_crew", "smooth_foot"];

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      experience_level,
      club_selection_answer,
      course_familiarity,
      etiquette_answer,
      motivation_and_people_skills,
    } = body;

    if (
      !experience_level ||
      !club_selection_answer ||
      !course_familiarity ||
      !etiquette_answer ||
      !motivation_and_people_skills
    ) {
      return NextResponse.json(
        { error: "All questions are required" },
        { status: 400 }
      );
    }

    if (!VALID_EXPERIENCE.includes(experience_level)) {
      return NextResponse.json({ error: "Invalid experience level" }, { status: 400 });
    }
    if (!VALID_CLUB.includes(club_selection_answer)) {
      return NextResponse.json({ error: "Invalid club selection answer" }, { status: 400 });
    }
    if (!VALID_ETIQUETTE.includes(etiquette_answer)) {
      return NextResponse.json({ error: "Invalid etiquette answer" }, { status: 400 });
    }
    if (course_familiarity.length < 20) {
      return NextResponse.json(
        { error: "Course familiarity answer is too short" },
        { status: 400 }
      );
    }
    if (motivation_and_people_skills.length < 30) {
      return NextResponse.json(
        { error: "Motivation answer is too short" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: caddie } = await supabase
      .from("caddies")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (!caddie) {
      return NextResponse.json(
        { error: "Caddie profile not found. Please complete onboarding first." },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("caddie_vetting_responses")
      .select("id")
      .eq("caddie_id", userId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "You have already completed the vetting questionnaire.", redirect: "/dashboard" },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabase
      .from("caddie_vetting_responses")
      .insert({
        caddie_id: userId,
        experience_level,
        club_selection_answer,
        course_familiarity,
        etiquette_answer,
        motivation_and_people_skills,
      });

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to save responses" },
        { status: 500 }
      );
    }

    await supabase
      .from("caddies")
      .update({ vetting_status: "completed" })
      .eq("id", userId);

    return NextResponse.json({
      message: "Vetting complete",
      redirect: "/dashboard",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
