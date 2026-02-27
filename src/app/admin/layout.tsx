import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId || !ADMIN_USER_IDS.includes(userId)) {
    redirect("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-65px)]">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
