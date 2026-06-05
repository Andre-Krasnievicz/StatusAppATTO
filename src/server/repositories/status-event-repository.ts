import { InstrumentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const userSelect = { select: { id: true, name: true } };

// ── Public ────────────────────────────────────────────────────────────────────

export async function findRecentEventsByInstrumentId(
  instrumentId: string,
  days: number
) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return prisma.statusEvent.findMany({
    where: { instrumentId, startedAt: { gte: since } },
    include: { createdBy: userSelect },
    orderBy: { startedAt: "desc" },
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function findAllEvents(filters?: {
  instrumentId?: string;
  newStatus?: InstrumentStatus;
  limit?: number;
}) {
  return prisma.statusEvent.findMany({
    where: {
      ...(filters?.instrumentId && { instrumentId: filters.instrumentId }),
      ...(filters?.newStatus && { newStatus: filters.newStatus }),
    },
    include: {
      instrument: { select: { id: true, name: true } },
      createdBy: userSelect,
    },
    orderBy: { startedAt: "desc" },
    take: filters?.limit ?? 200,
  });
}

export async function findEventsByInstrumentIdAdmin(instrumentId: string) {
  return prisma.statusEvent.findMany({
    where: { instrumentId },
    include: { createdBy: userSelect },
    orderBy: { startedAt: "desc" },
  });
}
