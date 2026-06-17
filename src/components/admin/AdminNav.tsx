import Link from "next/link";
import { LogoutButton } from "@/components/admin/instruments/LogoutButton";
import { getSession } from "@/lib/session";

type Session = Awaited<ReturnType<typeof getSession>>;

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/admin/events", label: "Histórico" },
  { href: "/admin/user", label: "Usuários" },
];

export function AdminNav({ session }: { session: Session }) {
  return (
    <nav className="border-b border-green-800 bg-green-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-semibold text-white hover:text-green-100"
          >
            Campina admin
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
            <span className="text-sm text-green-300">{session.user.name}</span>
          )}
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
