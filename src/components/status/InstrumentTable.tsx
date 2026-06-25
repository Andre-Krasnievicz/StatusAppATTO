"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InstrumentStatus } from "@prisma/client";
import { StatusBadge } from "./StatusBadge";
import { timeAgo, formatDateTime } from "@/lib/dates";
import { HiPencil, HiChevronRight, HiChevronDown } from "react-icons/hi2";
import { MdSignalWifiStatusbarNotConnected } from "react-icons/md";

type GroupSummary = {
  total: number;
  online: number;
  offline: number;
  unstable: number;
  maintenance: number;
};

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

const STATUS_LABELS: Record<string, string> = {
  "": "Todos os status",
  ONLINE: "Online",
  OFFLINE: "Offline",
  UNSTABLE: "Instável",
  MAINTENANCE: "Manutenção",
};

function GroupSummaryBadges({ summary }: { summary: GroupSummary }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="text-gray-500">
        {summary.total} instrumento{summary.total !== 1 ? "s" : ""}
      </span>

      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-emerald-800">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        {summary.online}
      </span>

      {summary.offline > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-red-800">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          {summary.offline}
        </span>
      )}

      {summary.unstable > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-amber-800">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          {summary.unstable}
        </span>
      )}

      {summary.maintenance > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-100 px-2 py-0.5 text-sky-800">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          {summary.maintenance}
        </span>
      )}
    </div>
  );
}

export function InstrumentTable({
  instruments,
  isAdmin,
}: {
  instruments: Instrument[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const groups = [...new Set(instruments.map((i) => i.group))].sort();
  const categories = [...new Set(instruments.map((i) => i.category))].sort();
  const locations = [...new Set(instruments.map((i) => i.location))].sort();
  const hasFilter =
    filterStatus || filterGroup || filterCategory || filterLocation;

  const filtered = instruments.filter((i) => {
    if (filterStatus && i.currentStatus !== filterStatus) return false;
    if (filterCategory && i.category !== filterCategory) return false;
    if (filterLocation && i.location !== filterLocation) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-md border border-green-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700"
        >
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-md border border-green-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700"
        >
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="rounded-md border border-green-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700"
        >
          <option value="">Todas as localizações</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        {hasFilter && (
          <button
            onClick={() => {
              setFilterStatus("");
              setFilterCategory("");
              setFilterLocation("");
            }}
            className="rounded-md border border-green-200 bg-white px-3 py-1.5 text-sm text-green-700 hover:bg-green-50"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={() => router.push("/instruments/station")}
          className="rounded-md bg-green-700 px-4 py-2 font-medium text-white hover:bg-green-800 disabled:opacity-50 cursor-pointer"
        >
          Estação Meteorológica
        </button>
      </div>

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
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={isAdmin ? 6 : 5}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  Nenhum instrumento encontrado
                </td>
              </tr>
            )}
            {filtered.map((instrument) => (
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

      <p className="text-xs text-gray-400">
        {filtered.length} de {instruments.length} instrumento
        {instruments.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
