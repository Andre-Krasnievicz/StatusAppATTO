import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPublicInstrumentById,
  getPublicInstrumentEvents,
} from "@/server/services/instrument-service";
import { StatusBadge } from "@/components/status/StatusBadge";
import { StatusHistory } from "@/components/status/StatusHistory";
import { formatDateTime } from "@/lib/dates";

export default async function InstrumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [instrument, events] = await Promise.all([
    getPublicInstrumentById(id),
    getPublicInstrumentEvents(id, 30),
  ]);

  if (!instrument) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-green-50">
      <header className="border-b border-green-800 bg-green-900">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-white">
                {instrument.name}
              </h1>
              <p className="text-sm text-green-300">
                {instrument.group} · {instrument.location}
              </p>
            </div>
            <StatusBadge status={instrument.currentStatus} />
          </div>
          {instrument.lastStatusUpdatedAt && (
            <p className="mt-1 text-xs text-green-400">
              Última atualização:{" "}
              {formatDateTime(instrument.lastStatusUpdatedAt)}
              {instrument.lastUpdatedBy &&
                ` · ${instrument.lastUpdatedBy.name}`}
            </p>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl grow px-4 py-8">
        <Link
          href="/"
          className="mb-3 inline-flex items-center gap-1 text-sm text-green-900 hover:text-green-500"
        >
          Voltar para status
        </Link>
        <h2 className="mb-4 text-base font-medium text-gray-700">
          Histórico dos últimos 30 dias
        </h2>
        <StatusHistory events={events} />
      </main>
    </div>
  );
}
