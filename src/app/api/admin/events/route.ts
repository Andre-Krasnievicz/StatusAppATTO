import { getSession } from "@/lib/session";
import { findAllEvents } from "@/server/repositories/status-event-repository";
import { InstrumentStatus } from "@prisma/client";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const instrumentId = searchParams.get("instrumentId") ?? undefined;
  const status = searchParams.get("status") as InstrumentStatus | null;

  const events = await findAllEvents({
    instrumentId,
    newStatus: status ?? undefined,
  });
  return Response.json(events);
}
