import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email, role } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const validRoles = ["player", "caddie", "instructor"];
    const safeRole = validRoles.includes(role) ? role : "player";

    const { error } = await supabase
      .from("waitlist")
      .insert({ email: email.toLowerCase().trim(), role: safeRole });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "You're already on the list!" },
          { status: 200 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "You're on the list! We'll be in touch." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
