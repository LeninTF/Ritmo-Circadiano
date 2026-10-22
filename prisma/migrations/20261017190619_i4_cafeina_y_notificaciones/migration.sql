-- CreateTable
CREATE TABLE "bebida" (
    "id_bebida" SERIAL NOT NULL,
    "nombre" VARCHAR(60) NOT NULL,
    "cafeina_mg" DECIMAL(5,1) NOT NULL,
    "volumen_ml" SMALLINT NOT NULL,

    CONSTRAINT "bebida_pkey" PRIMARY KEY ("id_bebida")
);

-- CreateTable
CREATE TABLE "ingesta_cafeina" (
    "id_ingesta" SERIAL NOT NULL,
    "id_usuario" UUID NOT NULL,
    "id_bebida" INTEGER,
    "cafeina_mg" DECIMAL(5,1) NOT NULL,
    "fecha_hora" TIMESTAMP(6) NOT NULL,
    "residual_estimado_mg" DECIMAL(5,1) NOT NULL,
    "client_id" UUID NOT NULL,

    CONSTRAINT "ingesta_cafeina_pkey" PRIMARY KEY ("id_ingesta")
);

-- CreateTable
CREATE TABLE "suscripcion_push" (
    "id_suscripcion" SERIAL NOT NULL,
    "id_usuario" UUID NOT NULL,
    "endpoint" TEXT NOT NULL,
    "clave_p256dh" VARCHAR(120) NOT NULL,
    "clave_auth" VARCHAR(60) NOT NULL,
    "fecha_alta" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suscripcion_push_pkey" PRIMARY KEY ("id_suscripcion")
);

-- CreateTable
CREATE TABLE "notificacion" (
    "id_notificacion" SERIAL NOT NULL,
    "id_usuario" UUID NOT NULL,
    "id_plan" INTEGER,
    "tipo" VARCHAR(20) NOT NULL,
    "programada_para" TIMESTAMP(6) NOT NULL,
    "enviada_en" TIMESTAMP(6),
    "estado" VARCHAR(12) NOT NULL DEFAULT 'pendiente',
    "abierta" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "notificacion_pkey" PRIMARY KEY ("id_notificacion")
);

-- CreateIndex
CREATE UNIQUE INDEX "bebida_nombre_key" ON "bebida"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ingesta_cafeina_client_id_key" ON "ingesta_cafeina"("client_id");

-- CreateIndex
CREATE INDEX "ingesta_cafeina_id_usuario_fecha_hora_idx" ON "ingesta_cafeina"("id_usuario", "fecha_hora");

-- CreateIndex
CREATE UNIQUE INDEX "suscripcion_push_endpoint_key" ON "suscripcion_push"("endpoint");

-- CreateIndex
CREATE INDEX "notificacion_estado_programada_para_idx" ON "notificacion"("estado", "programada_para");

-- AddForeignKey
ALTER TABLE "ingesta_cafeina" ADD CONSTRAINT "ingesta_cafeina_id_bebida_fkey" FOREIGN KEY ("id_bebida") REFERENCES "bebida"("id_bebida") ON DELETE RESTRICT ON UPDATE CASCADE;
