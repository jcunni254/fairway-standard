import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { role, fullName, email, avatarUrl, bio, phone, yearsExperience, hourlyRate, courseName, courseAddress, courseCity, courseState, courseZip, coursePhone, courseWebsite } = body;

    if (!role || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const validRoles = ["player", "caddie", "instructor", "course_manager"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: existingRole } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", role)
      .maybeSingle();

    if (existingRole) {
      return NextResponse.json({ error: "You already have this role", redirect: getRedirect(role) }, { status: 400 });
    }

    await supabase.from("user_roles").insert({ user_id: userId, role });

    if (role === "player") {
      await supabase.from("players").upsert({
        id: userId,
        full_name: fullName,
        email: email || null,
        avatar_url: avatarUrl || null,
        phone: phone || null,
      });
    }

    if (role === "caddie") {
      await supabase.from("caddies").upsert({
        id: userId,
        full_name: fullName,
        email: email || null,
        avatar_url: avatarUrl || null,
        bio: bio || null,
        phone: phone || null,
        years_experience: yearsExperience ? parseInt(yearsExperience) : null,
        subscription_status: "none",
      });
    }

    if (role === "instructor") {
      await supabase.from("instructors").upsert({
        id: userId,
        full_name: fullName,
        email: email || null,
        avatar_url: avatarUrl || null,
        bio: bio || null,
        phone: phone || null,
        years_experience: yearsExperience ? parseInt(yearsExperience) : null,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
      });
    }

    if (role === "course_manager") {
      if (!courseName) {
        return NextResponse.json({ error: "Course name is required" }, { status: 400 });
      }

      const { data: course } = await supabase
        .from("courses")
        .insert({
          name: courseName,
          address: courseAddress || null,
          city: courseCity || null,
          state: courseState || null,
          zip: courseZip || null,
          phone: coursePhone || null,
          website: courseWebsite || null,
          manager_id: userId,
        })
        .select("id")
        .single();

      if (!course) {
        return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
      }
    }

    return NextResponse.json({
      message: "Onboarding complete",
      role,
      redirect: getRedirect(role),
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

function getRedirect(role: string): string {
  switch (role) {
    case "caddie": return "/dashboard";
    case "instructor": return "/dashboard";
    case "course_manager": return "/course";
    case "player": return "/browse";
    default: return "/";
  }
}
