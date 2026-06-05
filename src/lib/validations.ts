import { z } from "zod";

export const InstrumentStatusEnum = z.enum([
  "ONLINE",
  "OFFLINE",
  "UNSTABLE",
  "MAINTENANCE",
]);

export const createInstrumentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  group: z.string().min(1, "Grupo é obrigatório").max(100),
  location: z.string().min(1, "Localização é obrigatória").max(100),
  currentStatus: InstrumentStatusEnum.default("ONLINE"),
  isActive: z.boolean().default(true),
});

export const updateInstrumentSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  group: z.string().min(1).max(100).optional(),
  location: z.string().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
});

export const statusUpdateSchema = z
  .object({
    newStatus: InstrumentStatusEnum,
    reason: z.string().trim().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.newStatus !== "ONLINE" &&
      (!data.reason || data.reason.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Motivo é obrigatório quando o status não for Online",
        path: ["reason"],
      });
    }
  });
