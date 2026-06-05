import { getSession } from "@/lib/session";
import { createInstrumentSchema } from "@/lib/validations";
import {
  getAdminInstruments,
  createInstrumentAdmin,
} from "@/server/services/instrument-service";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const instruments = await getAdminInstruments();
  return Response.json(instruments);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const result = createInstrumentSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 400 });
  }

  try {
    const instrument = await createInstrumentAdmin(result.data, session.user.id);
    return Response.json(instrument, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
