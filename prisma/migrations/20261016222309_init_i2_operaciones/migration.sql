-- CreateEnum
CREATE TYPE "estado_confirmacion" AS ENUM ('pendiente', 'confirmado', 'corregido');

-- CreateTable
CREATE TABLE "ruta" (
    "id" UUID NOT NULL,
    "origen" VARCHAR(120) NOT NULL,
    "destino" VARCHAR(120) NOT NULL,
    "distancia_km" DECIMAL(7,2) NOT NULL,
    "duracion_estimada_h" DECIMAL(4,2) NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ruta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turno_laboral" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "id_ruta" UUID NOT NULL,
    "fecha" DATE NOT NULL,
    "inicio_programado" TIMESTAMPTZ NOT NULL,
    "fin_programado" TIMESTAMPTZ NOT NULL,
    "horas_conduccion" DECIMAL(4,2) NOT NULL,
    "es_nocturno" BOOLEAN NOT NULL,
    "estado_confirmacion" "estado_confirmacion" NOT NULL DEFAULT 'pendiente',
    "hora_inicio_real" TIMESTAMPTZ,
    "hora_fin_real" TIMESTAMPTZ,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "turno_laboral_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "turno_laboral" ADD CONSTRAINT "turno_laboral_id_ruta_fkey" FOREIGN KEY ("id_ruta") REFERENCES "ruta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
