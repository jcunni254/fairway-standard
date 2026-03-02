import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isCourseRoute = createRouteMatcher(["/course(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isBookingsRoute = createRouteMatcher(["/bookings(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isAdminRoute(req)) {
    if (!userId || !ADMIN_USER_IDS.includes(userId)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (isCourseRoute(req) || isDashboardRoute(req) || isBookingsRoute(req) || isOnboardingRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL("/join", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
