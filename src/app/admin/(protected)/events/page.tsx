import { findAllEvents } from "@/server/repositories/status-event-repository";
import { StatusBadge } from "@/components/status/StatusBadge";
import { formatDateTime, formatDuration } from "@/lib/dates";

export default async function EventsPage() {
  const events = await findAllEvents({ limit: 200 });

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-900">
        Histórico de eventos
      </h1>

      <div className="overflow-hidden rounded-lg border border-green-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-green-100 bg-green-50 text-left text-xs font-medium uppercase tracking-wide text-green-700">
              <th className="px-4 py-3">Instrumento</th>
              <th className="px-4 py-3">Status</th>
              <th className="hidden px-4 py-3 sm:table-cell">Início</th>
              <th className="hidden px-4 py-3 md:table-cell">Fim</th>
              <th className="hidden px-4 py-3 lg:table-cell">Duração</th>
              <th className="hidden px-4 py-3 xl:table-cell">Motivo</th>
              <th className="hidden px-4 py-3 xl:table-cell">Usuário</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-50">
            {events.map((ev) => (
              <tr key={ev.id} className="hover:bg-green-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {ev.instrument.name}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={ev.newStatus} />
                </td>
                <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                  {formatDateTime(ev.startedAt)}
                </td>
                <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
                  {ev.endedAt ? formatDateTime(ev.endedAt) : "—"}
                </td>
                <td className="hidden px-4 py-3 text-gray-500 lg:table-cell">
                  {ev.endedAt
                    ? formatDuration(ev.startedAt, ev.endedAt)
                    : "Em curso"}
                </td>
                <td className="hidden max-w-xs truncate px-4 py-3 text-gray-600 xl:table-cell">
                  {ev.reason ?? "—"}
                </td>
                <td className="hidden px-4 py-3 text-gray-500 xl:table-cell">
                  {ev.createdBy?.name ?? "—"}
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Nenhum evento registrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
