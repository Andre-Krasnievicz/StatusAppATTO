"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Instrument = {
  id: string;
  name: string;
  group: string;
  location: string;
  isActive: boolean;
};

export function EditInstrumentForm({ instrument }: { instrument: Instrument }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      group: form.get("group"),
      location: form.get("location"),
      isActive: form.get("isActive") === "true",
    };

    const res = await fetch(`/api/admin/instruments/${instrument.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Erro ao salvar instrumento.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-green-100 bg-white p-6 shadow-sm"
    >
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <input
          name="name"
          required
          maxLength={100}
          defaultValue={instrument.name}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Grupo</label>
        <input
          name="group"
          required
          maxLength={100}
          defaultValue={instrument.group}
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
          defaultValue={instrument.location}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Ativo</label>
        <select
          name="isActive"
          defaultValue={instrument.isActive ? "true" : "false"}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="true">Sim</option>
          <option value="false">Não</option>
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
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
