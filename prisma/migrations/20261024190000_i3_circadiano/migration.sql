-- CreateEnum
CREATE TYPE "categoria_cronotipo" AS ENUM ('vespertino_definido', 'vespertino_moderado', 'intermedio', 'matutino_moderado', 'matutino_definido');

-- CreateTable
CREATE TABLE "ubicacion" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "lat" DECIMAL(9,6) NOT NULL,
    "lng" DECIMAL(9,6) NOT NULL,
    "origen" VARCHAR(60) NOT NULL,
    "zona_horaria" VARCHAR(40) NOT NULL DEFAULT 'America/Lima',
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ubicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento_solar" (
    "id" UUID NOT NULL,
    "id_ubicacion" UUID NOT NULL,
    "fecha" DATE NOT NULL,
    "amanecer" TIMESTAMPTZ NOT NULL,
    "mediodia" TIMESTAMPTZ NOT NULL,
    "atardecer" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "evento_solar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfil_cronotipo" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "respuestas_rmeq" JSONB NOT NULL,
    "puntaje" SMALLINT NOT NULL,
    "categoria" "categoria_cronotipo" NOT NULL,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "perfil_cronotipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_diario" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "id_turno" UUID,
    "fecha" DATE NOT NULL,
    "inicio_sueno" TIMESTAMPTZ NOT NULL,
    "fin_sueno" TIMESTAMPTZ NOT NULL,
    "inicio_siesta" TIMESTAMPTZ,
    "fin_siesta" TIMESTAMPTZ,
    "picos" JSONB NOT NULL,
    "hora_corte_cafeina" TIMESTAMPTZ,
    "ventana_luz" JSONB,
    "proteger_luz" BOOLEAN NOT NULL DEFAULT false,
    "categoria" "categoria_cronotipo" NOT NULL,
    "version_algoritmo" VARCHAR(20) NOT NULL,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "plan_diario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ubicacion_id_usuario_creado_en_idx" ON "ubicacion"("id_usuario", "creado_en");

-- CreateIndex
CREATE UNIQUE INDEX "evento_solar_id_ubicacion_fecha_key" ON "evento_solar"("id_ubicacion", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "perfil_cronotipo_id_usuario_key" ON "perfil_cronotipo"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "plan_diario_id_usuario_fecha_key" ON "plan_diario"("id_usuario", "fecha");

-- AddForeignKey
ALTER TABLE "evento_solar" ADD CONSTRAINT "evento_solar_id_ubicacion_fkey" FOREIGN KEY ("id_ubicacion") REFERENCES "ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

