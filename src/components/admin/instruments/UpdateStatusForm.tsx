"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type InstrumentStatus = "ONLINE" | "OFFLINE" | "UNSTABLE" | "MAINTENANCE";

const statusLabels: Record<InstrumentStatus, string> = {
  ONLINE: "Online",
  OFFLINE: "Offline",
  UNSTABLE: "Instável",
  MAINTENANCE: "Manutenção",
};

export function UpdateStatusForm({
  instrumentId,
  currentStatus,
}: {
  instrumentId: string;
  currentStatus: InstrumentStatus;
}) {
  const router = useRouter();
  const [newStatus, setNewStatus] = useState<InstrumentStatus>(currentStatus);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const reasonRequired = newStatus !== "ONLINE";
  const unchanged = newStatus === currentStatus;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (reasonRequired && !reason.trim()) {
      toast.error("Motivo é obrigatório quando o status não for Online.");
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/admin/instruments/${instrumentId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newStatus, reason: reason.trim() || undefined }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Erro ao atualizar status.");
      setLoading(false);
      return;
    }
    toast.success("Status atualizado com sucesso!");
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-green-100 bg-white p-6 shadow-sm"
    >
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Novo status
        </label>
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as InstrumentStatus)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {(Object.keys(statusLabels) as InstrumentStatus[]).map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400">
          Atual: {statusLabels[currentStatus]}
        </p>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Motivo{reasonRequired ? "" : " (opcional)"}
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={500}
          rows={3}
          required={reasonRequired}
          placeholder={
            reasonRequired
              ? "Descreva o motivo da mudança de status…"
              : "Opcional"
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex flex-col items-end gap-2 pt-2">
        {unchanged && (
          <p className="text-xs text-gray-400">
            Selecione um status diferente do atual.
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-green-200 px-4 py-2 text-sm text-green-700 hover:bg-green-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || unchanged}
            className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Atualizar status"}
          </button>
        </div>
      </div>
    </form>
  );
}
