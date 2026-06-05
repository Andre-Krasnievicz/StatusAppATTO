const TIMEZONE = "America/Manaus";

export function formatDateTime(
  date: Date | string | null | undefined
): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIMEZONE,
  }).format(new Date(date));
}

export function formatDuration(
  start: Date | string,
  end: Date | string | null | undefined
): string {
  if (!end) return "Em andamento";
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h < 24) return m > 0 ? `${h}h ${m}min` : `${h}h`;
  const days = Math.floor(h / 24);
  const hours = h % 24;
  return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
}

export function timeAgo(date: Date | string): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "agora mesmo";
  if (mins < 60) return `${mins}min atrás`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
}
