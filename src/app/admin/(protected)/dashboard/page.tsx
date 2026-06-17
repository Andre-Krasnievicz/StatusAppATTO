import Link from "next/link";
import { getAdminInstruments } from "@/server/services/instrument-service";
import { StatusBadge } from "@/components/status/StatusBadge";
import { timeAgo } from "@/lib/dates";
import { HiPencil } from "react-icons/hi2";
import { MdSignalWifiStatusbarNotConnected } from "react-icons/md";

export default async function DashboardPage() {
  const instruments = await getAdminInstruments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Instrumentos</h1>
        <Link
          href="/admin/instruments/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          + Novo instrumento
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-green-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-green-100 bg-green-50 text-left text-xs font-medium uppercase tracking-wide text-green-700">
              <th className="px-4 py-3">Instrumento</th>
              <th className="hidden px-4 py-3 sm:table-cell">Grupo</th>
              <th className="px-4 py-3">Status</th>
              <th className="hidden px-4 py-3 md:table-cell">Atualizado</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-50">
            {instruments.map((instrument) => (
              <tr
                key={instrument.id}
                className="hover:bg-green-50/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">
                    {instrument.name}
                  </div>
                  {!instrument.isActive && (
                    <span className="text-xs text-gray-400">Inativo</span>
                  )}
                </td>
                <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                  {instrument.group}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={instrument.currentStatus} />
                </td>
                <td className="hidden px-4 py-3 text-gray-500 md:table-cell">
                  {timeAgo(instrument.lastStatusUpdatedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/instruments/${instrument.id}/status`}
                      className="flex h-8 w-8 items-center justify-center rounded-md bg-green-100 text-gray-500 transition hover:bg-green-200 hover:text-gray-900"
                    >
                      <MdSignalWifiStatusbarNotConnected size={15} />
                    </Link>
                    <Link
                      href={`/admin/instruments/${instrument.id}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-md bg-green-100 text-gray-500 transition hover:bg-green-200 hover:text-gray-900"
                    >
                      <HiPencil size={15} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
