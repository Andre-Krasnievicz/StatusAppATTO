import {
  findActiveInstruments,
  findActiveInstrumentById,
  findAllInstruments,
  findInstrumentByIdAdmin,
  createInstrument,
  updateInstrumentData,
} from "@/server/repositories/instrument-repository";
import { findRecentEventsByInstrumentId } from "@/server/repositories/status-event-repository";

// ── Public ────────────────────────────────────────────────────────────────────

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
    isActive?: boolean;
  },
  userId: string
) {
  return createInstrument({ ...data, lastUpdatedByUserId: userId });
}

export async function updateInstrumentAdmin(
  id: string,
  data: { name?: string; group?: string; location?: string; isActive?: boolean }
) {
  const instrument = await findInstrumentByIdAdmin(id);
  if (!instrument) throw new Error("Instrumento não encontrado");
  return updateInstrumentData(id, data);
}
