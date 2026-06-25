"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewInstrumentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("ONLINE");
  const [reason, setReason] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      group: form.get("group"),
      location: form.get("location"),
      currentStatus: form.get("currentStatus"),
      reason: reason.trim() || undefined,
      isActive: true,
      category: form.get("category"),
    };

    const res = await fetch("/api/admin/instruments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Erro ao criar instrumento.");
      setLoading(false);
      return;
    }
    toast.success("Instrumento criado com sucesso!");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-lg font-semibold text-gray-900">Novo instrumento</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg border border-green-100 bg-white p-6 shadow-sm"
      >
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            name="name"
            required
            maxLength={100}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Grupo
          </label>
          <input
            name="group"
            required
            maxLength={100}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Categoria
          </label>
          <input
            name="category"
            required
            maxLength={100}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Status inicial
          </label>
          <select
            name="currentStatus"
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
            <option value="UNSTABLE">Instável</option>
            <option value="MAINTENANCE">Manutenção</option>
          </select>
        </div>
        {currentStatus !== "ONLINE" && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Motivo
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              rows={3}
              required
              placeholder="Descreva o motivo"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}
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
