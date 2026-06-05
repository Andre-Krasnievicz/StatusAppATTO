import { getSession } from "@/lib/session";
import { statusUpdateSchema } from "@/lib/validations";
import { updateInstrumentStatus } from "@/server/services/status-event-service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const result = statusUpdateSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 400 });
  }

  try {
    const instrument = await updateInstrumentStatus({
      instrumentId: id,
      newStatus: result.data.newStatus,
      reason: result.data.reason,
      userId: session.user.id,
    });
    return Response.json(instrument);
  } catch (error) {
    if (error instanceof Error) {
      const clientErrors = [
        "Instrumento não encontrado",
        "Instrumento inativo",
        "Instrumento já possui este status",
        "Motivo é obrigatório quando o status não for Online",
      ];
      if (clientErrors.includes(error.message)) {
        return Response.json({ error: error.message }, { status: 400 });
      }
    }
    console.error(error);
    return Response.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
