"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewInstrumentPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      group: form.get("group"),
      location: form.get("location"),
      currentStatus: form.get("currentStatus"),
      isActive: true,
    };

    const res = await fetch("/api/admin/instruments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erro ao criar instrumento.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-lg font-semibold text-gray-900">Novo instrumento</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg border border-green-100 bg-white p-6 shadow-sm"
      >
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            name="name"
            required
            maxLength={100}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Grupo</label>
          <input
            name="group"
            required
            maxLength={100}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Localização
          </label>
          <input
            name="location"
            required
            maxLength={100}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Status inicial
          </label>
          <select
            name="currentStatus"
            defaultValue="ONLINE"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
            <option value="UNSTABLE">Instável</option>
            <option value="MAINTENANCE">Manutenção</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-green-200 px-4 py-2 text-sm text-green-700 hover:bg-green-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar instrumento"}
          </button>
        </div>
      </form>
    </div>
  );
}
