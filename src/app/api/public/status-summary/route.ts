import { getStatusSummary } from "@/server/services/instrument-service";

export async function GET() {
  const summary = await getStatusSummary();
  return Response.json(summary);
}
