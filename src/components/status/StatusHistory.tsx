import { InstrumentStatus } from "@prisma/client";
import { StatusBadge } from "./StatusBadge";
import { formatDateTime, formatDuration } from "@/lib/dates";

type StatusEvent = {
  id: string;
  previousStatus: InstrumentStatus;
  newStatus: InstrumentStatus;
  reason: string | null;
  startedAt: Date | string;
  endedAt: Date | string | null;
  createdBy: { id: string; name: string } | null;
};

export function StatusHistory({ events }: { events: StatusEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        Nenhum evento registrado no período.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-green-100 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-green-100 bg-green-50 text-left text-xs font-medium uppercase tracking-wide text-green-700">
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Início</th>
            <th className="px-4 py-3">Término</th>
            <th className="hidden px-4 py-3 sm:table-cell">Duração</th>
            <th className="hidden px-4 py-3 md:table-cell">Motivo</th>
            <th className="hidden px-4 py-3 lg:table-cell">Usuário</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-green-50">
          {events.map((event) => (
            <tr key={event.id} className="transition-colors hover:bg-green-50/50">
              <td className="px-4 py-3">
                <StatusBadge status={event.newStatus} />
              </td>
              <td className="px-4 py-3 text-gray-600">
                {formatDateTime(event.startedAt)}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {event.endedAt ? (
                  formatDateTime(event.endedAt)
                ) : (
                  <span className="font-medium text-amber-600">Em andamento</span>
                )}
              </td>
              <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                {formatDuration(event.startedAt, event.endedAt)}
              </td>
              <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
                {event.reason ?? <span className="text-gray-300">—</span>}
              </td>
              <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">
                {event.createdBy?.name ?? <span className="text-gray-300">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
