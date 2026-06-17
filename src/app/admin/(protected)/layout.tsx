import { AdminNav } from "@/components/admin/AdminNav";
import { getSession } from "@/lib/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <div className="min-h-screen bg-green-50">
      <AdminNav session={session} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
