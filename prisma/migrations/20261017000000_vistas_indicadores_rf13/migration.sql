-- CreateView v_ind_descanso
CREATE OR REPLACE VIEW v_ind_descanso AS
SELECT 
  id_usuario,
  fecha,
  EXTRACT(EPOCH FROM (inicio_programado - LAG(fin_programado) OVER (PARTITION BY id_usuario ORDER BY inicio_programado))) / 3600.0 AS horas_descanso_previo
FROM turno_laboral;

-- CreateView v_ind_cafeina
CREATE OR REPLACE VIEW v_ind_cafeina AS
SELECT 
  id_usuario,
  fecha,
  es_nocturno,
  horas_conduccion
FROM turno_laboral;

-- CreateView v_ind_adherencia
CREATE OR REPLACE VIEW v_ind_adherencia AS
SELECT 
  id_usuario,
  fecha,
  estado_confirmacion,
  CASE WHEN hora_inicio_real IS NOT NULL AND hora_fin_real IS NOT NULL THEN 1 ELSE 0 END AS completado
FROM turno_laboral;
