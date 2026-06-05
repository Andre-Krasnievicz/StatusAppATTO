import { getSession } from "@/lib/session";
import { findEventsByInstrumentIdAdmin } from "@/server/repositories/status-event-repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const events = await findEventsByInstrumentIdAdmin(id);
  return Response.json(events);
}
