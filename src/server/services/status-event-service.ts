import { InstrumentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function updateInstrumentStatus({
  instrumentId,
  newStatus,
  reason,
  userId,
}: {
  instrumentId: string;
  newStatus: InstrumentStatus;
  reason?: string;
  userId: string;
}) {
  const instrument = await prisma.instrument.findUnique({
    where: { id: instrumentId },
  });

  if (!instrument) throw new Error("Instrumento não encontrado");
  if (!instrument.isActive) throw new Error("Instrumento inativo");
  if (instrument.currentStatus === newStatus)
    throw new Error("Instrumento já possui este status");

  return prisma.$transaction(async (tx) => {
    const now = new Date();

    // Close any open event before changing status
    await tx.statusEvent.updateMany({
      where: { instrumentId, endedAt: null },
      data: { endedAt: now },
    });

    // Open a new event only when moving away from ONLINE
    if (newStatus !== "ONLINE") {
      await tx.statusEvent.create({
        data: {
          instrumentId,
          previousStatus: instrument.currentStatus,
          newStatus,
          reason: reason?.trim() || null,
          startedAt: now,
          createdById: userId,
        },
      });
    }

    return tx.instrument.update({
      where: { id: instrumentId },
      data: {
        currentStatus: newStatus,
        lastStatusUpdatedAt: now,
        lastUpdatedByUserId: userId,
      },
    });
  });
}
