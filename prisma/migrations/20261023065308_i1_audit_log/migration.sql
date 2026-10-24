-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL,
    "id_usuario" UUID,
    "accion" VARCHAR(60) NOT NULL,
    "recurso" VARCHAR(255) NOT NULL,
    "ip" VARCHAR(45),
    "fecha" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_log_fecha_idx" ON "audit_log"("fecha");
