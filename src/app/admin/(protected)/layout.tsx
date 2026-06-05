import Link from "next/link";
import { getSession } from "@/lib/session";
import { LogoutButton } from "@/components/admin/LogoutButton";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/events", label: "Histórico" },
  { href: "/", label: "Status geral" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-green-50">
      <nav className="border-b border-green-800 bg-green-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <Link
              href="/admin/dashboard"
              className="font-semibold text-white hover:text-green-100"
            >
              ATTO admin
            </Link>
            <div className="flex gap-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-green-200 hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {session && (
              <span className="text-sm text-green-300">
                {session.user.name}
              </span>
            )}
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
