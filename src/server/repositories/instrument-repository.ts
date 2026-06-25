import { InstrumentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const userSelect = { select: { id: true, name: true } };

// ── Public ────────────────────────────────────────────────────────────────────

export async function findActiveInstruments() {
  return prisma.instrument.findMany({
    where: { isActive: true },
    include: { lastUpdatedBy: userSelect },
    orderBy: { name: "asc" },
  });
}

export async function findActiveInstrumentById(id: string) {
  return prisma.instrument.findFirst({
    where: { id, isActive: true },
    include: { lastUpdatedBy: userSelect },
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function findAllInstruments() {
  return prisma.instrument.findMany({
    include: { lastUpdatedBy: userSelect },
    orderBy: { name: "asc" },
  });
}

export async function findInstrumentByIdAdmin(id: string) {
  return prisma.instrument.findUnique({
    where: { id },
    include: { lastUpdatedBy: userSelect },
  });
}

export async function createInstrument(data: {
  name: string;
  group: string;
  location: string;
  currentStatus?: InstrumentStatus;
  isActive?: boolean;
  lastUpdatedByUserId?: string;
  category: string;
}) {
  return prisma.instrument.create({ data });
}

export async function updateInstrumentData(
  id: string,
  data: {
    name?: string;
    group?: string;
    location?: string;
    isActive?: boolean;
    category?: string;
  },
) {
  return prisma.instrument.update({ where: { id }, data });
}
