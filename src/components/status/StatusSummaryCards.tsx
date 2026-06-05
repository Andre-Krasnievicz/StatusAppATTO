type Summary = {
  total: number;
  online: number;
  offline: number;
  unstable: number;
  maintenance: number;
};

const cards = [
  { key: "total", label: "Total", dot: "bg-gray-400" },
  { key: "online", label: "Online", dot: "bg-emerald-500" },
  { key: "offline", label: "Offline", dot: "bg-red-500" },
  { key: "unstable", label: "Instável", dot: "bg-amber-500" },
  { key: "maintenance", label: "Manutenção", dot: "bg-sky-500" },
] as const;

export function StatusSummaryCards({ summary }: { summary: Summary }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {cards.map(({ key, label, dot }) => (
        <div
          key={key}
          className="flex flex-col gap-1 rounded-lg border border-green-100 bg-white px-4 py-3 shadow-sm"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className={`h-2 w-2 rounded-full ${dot}`} />
            {label}
          </div>
          <span className="text-2xl font-semibold text-gray-900">
            {summary[key]}
          </span>
        </div>
      ))}
    </div>
  );
}
