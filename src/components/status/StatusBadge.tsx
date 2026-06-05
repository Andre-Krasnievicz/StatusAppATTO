import { InstrumentStatus } from "@prisma/client";

const config: Record<
  InstrumentStatus,
  { label: string; dot: string; badge: string }
> = {
  ONLINE: {
    label: "Online",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  },
  OFFLINE: {
    label: "Offline",
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-800 border border-red-200",
  },
  UNSTABLE: {
    label: "Instável",
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-800 border border-amber-200",
  },
  MAINTENANCE: {
    label: "Manutenção",
    dot: "bg-sky-500",
    badge: "bg-sky-100 text-sky-800 border border-sky-200",
  },
};

export function StatusBadge({ status }: { status: InstrumentStatus }) {
  const { label, dot, badge } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

export function statusLabel(status: InstrumentStatus): string {
  return config[status].label;
}

export function statusDotColor(status: InstrumentStatus): string {
  return config[status].dot;
}
