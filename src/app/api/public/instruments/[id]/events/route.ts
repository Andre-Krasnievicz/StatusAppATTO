import { getPublicInstrumentEvents } from "@/server/services/instrument-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const rawDays = Number(searchParams.get("days"));
  const days = Math.min(!rawDays || rawDays <= 0 ? 30 : rawDays, 90);

  const events = await getPublicInstrumentEvents(id, days);
  return Response.json(events);
}
