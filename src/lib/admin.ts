import { auth } from "@clerk/nextjs/server";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId || !ADMIN_USER_IDS.includes(userId)) {
    return null;
  }
  return userId;
}

export function isAdmin(userId: string) {
  return ADMIN_USER_IDS.includes(userId);
}
