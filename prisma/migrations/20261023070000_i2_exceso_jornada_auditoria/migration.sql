-- El modelo ExcesoJornadaAuditoria (RF14) estaba en el esquema sin migracion.
-- CreateTable
CREATE TABLE "exceso_jornada_auditoria" (
    "id" UUID NOT NULL,
    "id_turno" UUID,
    "id_usuario" UUID NOT NULL,
    "fecha" DATE NOT NULL,
    "horas_conduccion" DECIMAL(4,2) NOT NULL,
    "motivo_exceso" TEXT NOT NULL,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exceso_jornada_auditoria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exceso_jornada_auditoria" ADD CONSTRAINT "exceso_jornada_auditoria_id_turno_fkey" FOREIGN KEY ("id_turno") REFERENCES "turno_laboral"("id") ON DELETE SET NULL ON UPDATE CASCADE;
