-- CreateEnum
CREATE TYPE "color_aptitud" AS ENUM ('verde', 'ambar', 'rojo');

-- CreateTable
CREATE TABLE "aptitud_presalida" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "id_turno" UUID NOT NULL,
    "fecha_hora" TIMESTAMPTZ NOT NULL,
    "horas_sueno_24h" DECIMAL(5,3) NOT NULL,
    "somnolencia" INTEGER NOT NULL,
    "color" "color_aptitud" NOT NULL,
    "compartido" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aptitud_presalida_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "aptitud_presalida_id_usuario_fecha_hora_idx" ON "aptitud_presalida"("id_usuario", "fecha_hora");

-- CreateIndex
CREATE INDEX "aptitud_presalida_id_turno_idx" ON "aptitud_presalida"("id_turno");
