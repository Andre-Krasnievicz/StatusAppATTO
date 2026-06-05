import { getSession } from "@/lib/session";
import { updateInstrumentSchema } from "@/lib/validations";
import {
  getAdminInstrumentById,
  updateInstrumentAdmin,
} from "@/server/services/instrument-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const instrument = await getAdminInstrumentById(id);
  if (!instrument) return Response.json({ error: "Não encontrado" }, { status: 404 });

  return Response.json(instrument);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const result = updateInstrumentSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 400 });
  }

  try {
    const instrument = await updateInstrumentAdmin(id, result.data);
    return Response.json(instrument);
  } catch (error) {
    if (error instanceof Error && error.message === "Instrumento não encontrado") {
      return Response.json({ error: error.message }, { status: 404 });
    }
    console.error(error);
    return Response.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
