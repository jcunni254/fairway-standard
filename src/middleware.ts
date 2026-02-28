import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isCourseRoute = createRouteMatcher(["/course(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isBookingsRoute = createRouteMatcher(["/bookings(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isCourseRoute(req) || isDashboardRoute(req) || isBookingsRoute(req)) {
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
