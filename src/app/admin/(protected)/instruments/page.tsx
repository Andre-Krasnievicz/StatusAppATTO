import Link from "next/link";
import { getAdminInstruments } from "@/server/services/instrument-service";
import { StatusBadge } from "@/components/status/StatusBadge";

export default async function InstrumentsPage() {
  const instruments = await getAdminInstruments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Instrumentos</h1>
        <Link
          href="/admin/instruments/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          + Novo
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-green-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-green-100 bg-green-50 text-left text-xs font-medium uppercase tracking-wide text-green-700">
              <th className="px-4 py-3">Nome</th>
              <th className="hidden px-4 py-3 sm:table-cell">Grupo</th>
              <th className="hidden px-4 py-3 md:table-cell">Localização</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ativo</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-50">
            {instruments.map((i) => (
              <tr key={i.id} className="hover:bg-green-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{i.name}</td>
                <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                  {i.group}
                </td>
                <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
                  {i.location}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={i.currentStatus} />
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {i.isActive ? "Sim" : "Não"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/instruments/${i.id}/status`}
                      className="text-green-700 hover:text-green-900 hover:underline"
                    >
                      Status
                    </Link>
                    <Link
                      href={`/admin/instruments/${i.id}/edit`}
                      className="text-gray-500 hover:text-gray-700 hover:underline"
                    >
                      Editar
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
