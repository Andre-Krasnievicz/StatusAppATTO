import { getPublicInstruments } from "@/server/services/instrument-service";

export async function GET() {
  const instruments = await getPublicInstruments();
  return Response.json(instruments);
}
