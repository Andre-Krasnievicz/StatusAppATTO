import {
  findActiveInstruments,
  findActiveInstrumentById,
  findAllInstruments,
  findInstrumentByIdAdmin,
  createInstrument,
  updateInstrumentData,
} from "@/server/repositories/instrument-repository";
import { findRecentEventsByInstrumentId } from "@/server/repositories/status-event-repository";
import { prisma } from "@/lib/prisma";
// ── Public ────────────────────────────────────────────────────────────────────
export async function getInstrumentsStation() {
  const instruments = await prisma.instrument.findMany({
    where: { group: "Estação meteorológica" },
    include: { lastUpdatedBy: { select: { id: true, name: true } } },
  });
  return instruments;
}

export async function getPublicInstruments() {
  return findActiveInstruments();
}

export async function getPublicInstrumentById(id: string) {
  return findActiveInstrumentById(id);
}

export async function getPublicInstrumentEvents(id: string, days: number) {
  return findRecentEventsByInstrumentId(id, days);
}

export async function getStatusSummary() {
  const instruments = await findActiveInstruments();
  return {
    total: instruments.length,
    online: instruments.filter((i) => i.currentStatus === "ONLINE").length,
    offline: instruments.filter((i) => i.currentStatus === "OFFLINE").length,
    unstable: instruments.filter((i) => i.currentStatus === "UNSTABLE").length,
    maintenance: instruments.filter((i) => i.currentStatus === "MAINTENANCE")
      .length,
  };
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function getAdminInstruments() {
  return findAllInstruments();
}

export async function getAdminInstrumentById(id: string) {
  return findInstrumentByIdAdmin(id);
}

export async function createInstrumentAdmin(
  data: {
    name: string;
    group: string;
    location: string;
    currentStatus?: "ONLINE" | "OFFLINE" | "UNSTABLE" | "MAINTENANCE";
    reason?: string;
    isActive?: boolean;
    category: string;
  },
  userId: string,
) {
  if (data.currentStatus === "ONLINE") {
    return createInstrument({ ...data, lastUpdatedByUserId: userId });
  }
  return prisma.$transaction(async (tx) => {
    const instrument = await tx.instrument.create({
      data: {
        name: data.name,
        group: data.group,
        location: data.location,
        currentStatus: data.currentStatus ?? "ONLINE",
        isActive: data.isActive ?? true,
        lastUpdatedByUserId: userId,
        category: data.category,
      },
    });

    const now = new Date();
    if (data.currentStatus !== "ONLINE") {
      await tx.statusEvent.create({
        data: {
          instrumentId: instrument.id,
          previousStatus: "ONLINE",
          newStatus: instrument.currentStatus,
          reason: data.reason?.trim() || null,
          startedAt: now,
          createdById: userId,
        },
      });
    }

    return instrument;
  });
}

export async function updateInstrumentAdmin(
  id: string,
  data: {
    name?: string;
    group?: string;
    location?: string;
    isActive?: boolean;
    category?: string;
  },
) {
  const instrument = await findInstrumentByIdAdmin(id);
  if (!instrument) throw new Error("Instrumento não encontrado");
  return updateInstrumentData(id, data);
}
