"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.signIn.email({ email, password });

    if (error) {
      setError("E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <main
      style={{ backgroundImage: "url('/fundoTorreAlta.jpg')" }}
      className="flex min-h-screen items-center justify-center bg-green-50 bg-cover"
    >
      <div className="w-full max-w-sm">
        <div className="overflow-hidden rounded-xl border border-green-100 bg-white shadow-sm">
          <div className="px-8 py-8">
            <div className="mb-6">
              <p className="text-x font-medium uppercase tracking-widest text-green-700">
                ATTO
              </p>
              <h1 className="mt-1 text-xl font-semibold text-gray-900">
                Acesso administrativo
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-green-700 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
