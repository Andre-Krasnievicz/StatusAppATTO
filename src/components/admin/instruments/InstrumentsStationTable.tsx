import { InstrumentStatus } from "@prisma/client";
import { formatDateTime, timeAgo } from "@/lib/dates";
import Link from "next/link";
import { StatusBadge } from "@/components/status/StatusBadge";
import { HiPencil } from "react-icons/hi2";
import { MdSignalWifiStatusbarNotConnected } from "react-icons/md";

type Instrument = {
  id: string;
  name: string;
  group: string;
  category: string;
  location: string;
  currentStatus: InstrumentStatus;
  lastStatusUpdatedAt: Date | string;
  lastUpdatedBy: { id: string; name: string } | null;
};

export function InstrumentsStationTable({
  instruments,
  isAdmin,
}: {
  instruments: Instrument[];
  isAdmin: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-green-100 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-green-100 bg-green-50 text-left text-xs font-medium uppercase tracking-wide text-green-700">
            <th className="px-4 py-3">Instrumento</th>
            <th className="hidden px-4 py-3 sm:table-cell">Grupo</th>
            <th className="hidden px-4 py-3 sm:table-cell">Categoria</th>
            <th className="hidden px-4 py-3 md:table-cell">Localização</th>
            <th className="px-4 py-3">Status</th>
            <th className="hidden px-4 py-3 lg:table-cell">
              Última atualização
            </th>
            {/*Deve aparecer se usuário tiver logado*/}
            {isAdmin ? (
              <th className="hidden px-4 py-3 lg:table-cell">Ações</th>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-green-50">
          {instruments.length === 0 && (
            <tr>
              <td
                colSpan={isAdmin ? 6 : 5}
                className="px-4 py-8 text-center text-gray-400"
              >
                Nenhum instrumento encontrado
              </td>
            </tr>
          )}
          {instruments.map((instrument) => (
            <tr
              key={instrument.id}
              className="transition-colors hover:bg-green-50/50"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/instruments/${instrument.id}`}
                  className="font-medium text-green-800 hover:text-green-600 hover:underline"
                >
                  {instrument.name}
                </Link>
              </td>
              <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                {instrument.group}
              </td>
              <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                {instrument.category}
              </td>
              <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
                {instrument.location}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={instrument.currentStatus} />
              </td>
              <td className="hidden px-4 py-3 lg:table-cell">
                <span
                  className="text-gray-500"
                  title={formatDateTime(instrument.lastStatusUpdatedAt)}
                >
                  {timeAgo(instrument.lastStatusUpdatedAt)}
                  {instrument.lastUpdatedBy && (
                    <span className="ml-1 text-gray-400">
                      · {instrument.lastUpdatedBy.name}
                    </span>
                  )}
                </span>
              </td>
              {/*Deve aparecer se usuário tiver logado*/}
              {isAdmin ? (
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
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
