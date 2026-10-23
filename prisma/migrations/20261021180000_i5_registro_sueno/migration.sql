-- CreateTable
CREATE TABLE "registro_sueno" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "fecha" DATE NOT NULL,
    "hora_acostarse" TIMESTAMPTZ NOT NULL,
    "hora_despertar" TIMESTAMPTZ NOT NULL,
    "latencia_min" INTEGER NOT NULL DEFAULT 0,
    "despertares" INTEGER NOT NULL DEFAULT 0,
    "calidad_percibida" INTEGER NOT NULL,
    "fatiga_percibida" INTEGER NOT NULL,
    "es_dia_laboral" BOOLEAN NOT NULL DEFAULT true,
    "luz_matutina_min" INTEGER NOT NULL DEFAULT 0,
    "client_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "registro_sueno_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "registro_sueno_client_id_key" ON "registro_sueno"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "registro_sueno_id_usuario_fecha_key" ON "registro_sueno"("id_usuario", "fecha");
