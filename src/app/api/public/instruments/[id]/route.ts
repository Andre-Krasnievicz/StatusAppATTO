import { getPublicInstrumentById } from "@/server/services/instrument-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const instrument = await getPublicInstrumentById(id);

  if (!instrument) {
    return Response.json(
      { error: "Instrumento não encontrado" },
      { status: 404 },
    );
  }

  return Response.json(instrument);
}
