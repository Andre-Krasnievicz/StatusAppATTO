/*
  Warnings:

  - Added the required column `category` to the `instrument` table without a default value. This is not possible if the table is not empty.

*/
-- Adiciona coluna category com default temporário
ALTER TABLE "instrument" ADD COLUMN "category" TEXT NOT NULL DEFAULT '';

-- Copia o valor atual de group para category (preserva semântica atual)
UPDATE "instrument" SET "category" = "group";

-- Remove o default temporário
ALTER TABLE "instrument" ALTER COLUMN "category" DROP DEFAULT;

-- Define um grupo padrão para instrumentos existentes (admin atualizará depois)
UPDATE "instrument" SET "group" = 'Geral';

-- CreateIndex
CREATE INDEX "instrument_category_idx" ON "instrument"("category");
