-- AddForeignKey
ALTER TABLE "aptitud_presalida" ADD CONSTRAINT "aptitud_presalida_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aptitud_presalida" ADD CONSTRAINT "aptitud_presalida_id_turno_fkey" FOREIGN KEY ("id_turno") REFERENCES "turno_laboral"("id") ON DELETE CASCADE ON UPDATE CASCADE;

