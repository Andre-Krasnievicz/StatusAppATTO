import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { auth } from "../src/lib/auth";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const instruments = [
  {
    id: "mira-35c",
    name: "Perfilador de nuvem MIRA-35C",
    group: "Radar e perfilamento",
    location: "ATTO/Campina",
    currentStatus: "ONLINE" as const,
  },
  {
    id: "lap3000",
    name: "LAP3000",
    group: "Radar e perfilamento",
    location: "ATTO/Campina",
    currentStatus: "OFFLINE" as const,
  },
  {
    id: "disdrometro-impacto",
    name: "Disdrômetro de impacto",
    group: "Precipitação",
    location: "ATTO/Campina",
    currentStatus: "ONLINE" as const,
  },
  {
    id: "disdrometro-optico",
    name: "Disdrômetro óptico",
    group: "Precipitação",
    location: "ATTO/Campina",
    currentStatus: "MAINTENANCE" as const,
  },
  {
    id: "estacao-meteorologica",
    name: "Estação meteorológica",
    group: "Meteorologia",
    location: "ATTO/Campina",
    currentStatus: "UNSTABLE" as const,
  },
];

async function main() {
  console.log("Criando instrumentos...");

  for (const instrument of instruments) {
    await prisma.instrument.upsert({
      where: { id: instrument.id },
      update: {},
      create: instrument,
    });
  }

  // Eventos abertos para instrumentos que não estão online.
  // Representa a situação atual de cada equipamento no momento do seed.
  const eventosIniciais = [
    {
      instrumentId: "lap3000",
      previousStatus: "ONLINE" as const,
      newStatus: "OFFLINE" as const,
      reason: "Falha de comunicação com o datalogger",
    },
    {
      instrumentId: "disdrometro-optico",
      previousStatus: "ONLINE" as const,
      newStatus: "MAINTENANCE" as const,
      reason: "Calibração periódica programada",
    },
    {
      instrumentId: "estacao-meteorologica",
      previousStatus: "ONLINE" as const,
      newStatus: "UNSTABLE" as const,
      reason: "Atraso intermitente no envio de dados",
    },
  ];

  console.log("Criando eventos de status...");

  for (const evento of eventosIniciais) {
    const existente = await prisma.statusEvent.findFirst({
      where: { instrumentId: evento.instrumentId, endedAt: null },
    });

    if (!existente) {
      await prisma.statusEvent.create({ data: evento });
    }
  }

  console.log("Criando usuário admin...");
  const existingUser = await prisma.user.findUnique({
    where: { email: "admin@status.local" },
  });
  if (!existingUser) {
    await auth.api.signUpEmail({
      body: {
        email: "admin@status.local",
        password: "admin123",
        name: "Administrador",
      },
    });
  }

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
