-- CreateTable
CREATE TABLE "evaluacion" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "fase" VARCHAR(8) NOT NULL,
    "instrumento" VARCHAR(10) NOT NULL,
    "fecha_aplicacion" DATE NOT NULL,
    "puntaje_total" DECIMAL(5,2),
    "respuestas" JSONB,

    CONSTRAINT "evaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resultado_indicador" (
    "id" UUID NOT NULL,
    "id_evaluacion" UUID NOT NULL,
    "codigo_indicador" VARCHAR(10) NOT NULL,
    "valor" DECIMAL(7,2) NOT NULL,
    "unidad" VARCHAR(12),

    CONSTRAINT "resultado_indicador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "evaluacion_id_usuario_fase_idx" ON "evaluacion"("id_usuario", "fase");

-- CreateIndex
CREATE UNIQUE INDEX "resultado_indicador_id_evaluacion_codigo_indicador_key" ON "resultado_indicador"("id_evaluacion", "codigo_indicador");

-- AddForeignKey
ALTER TABLE "evaluacion" ADD CONSTRAINT "evaluacion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultado_indicador" ADD CONSTRAINT "resultado_indicador_id_evaluacion_fkey" FOREIGN KEY ("id_evaluacion") REFERENCES "evaluacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Vista del Anexo 6 (Tabla 28): una fila por participante activo con sus indicadores del pretest.
-- Sin correo, hash_clave ni nombres: solo codigo_participante (Ley 29733).
CREATE VIEW "base_datos_pretest" AS
WITH r AS (
    SELECT
        e.id_usuario,
        max(e.fecha_aplicacion) AS fecha_aplicacion,
        max(ri.valor) FILTER (WHERE ri.codigo_indicador = 'PSQI_C1')::smallint AS psqi_c1_calidad_subjetiva,
        max(ri.valor) FILTER (WHERE ri.codigo_indicador = 'PSQI_C2')::smallint AS psqi_c2_latencia,
        max(ri.valor) FILTER (WHERE ri.codigo_indicador = 'PSQI_C3')::smallint AS psqi_c3_duracion,
        max(ri.valor) FILTER (WHERE ri.codigo_indicador = 'PSQI_C4')::smallint AS psqi_c4_eficiencia,
        max(ri.valor) FILTER (WHERE ri.codigo_indicador = 'PSQI_C5')::smallint AS psqi_c5_perturbaciones,
        max(ri.valor) FILTER (WHERE ri.codigo_indicador = 'PSQI_C6')::smallint AS psqi_c6_medicacion,
        max(ri.valor) FILTER (WHERE ri.codigo_indicador = 'PSQI_C7')::smallint AS psqi_c7_disfuncion_diurna,
        max(ri.valor) FILTER (WHERE ri.codigo_indicador = 'PSQI_G')::smallint AS psqi_global,
        max(ri.valor) FILTER (WHERE ri.codigo_indicador = 'ESS')::smallint AS ess_total,
        max(ri.valor) FILTER (WHERE ri.codigo_indicador = 'JETLAG')::numeric(4,2) AS jetlag_social_h,
        max(ri.valor) FILTER (WHERE ri.codigo_indicador = 'CAF_DIA')::numeric(6,1) AS cafeina_diaria_mg,
        max(ri.valor) FILTER (WHERE ri.codigo_indicador = 'CAF_RES')::numeric(6,1) AS cafeina_residual_mg,
        max(ri.valor) FILTER (WHERE ri.codigo_indicador = 'LUZ_MAT')::smallint AS luz_matutina_min,
        max(ri.valor) FILTER (WHERE ri.codigo_indicador = 'CAF_ULT') AS hora_ultima_cafeina_h
    FROM evaluacion e
    JOIN resultado_indicador ri ON ri.id_evaluacion = e.id
    WHERE e.fase = 'pretest'
    GROUP BY e.id_usuario
),
t AS (
    SELECT id_usuario,
        CASE WHEN avg(CASE WHEN es_nocturno THEN 1 ELSE 0 END) > 0.5 THEN 'nocturno' ELSE 'diurno' END AS tipo
    FROM turno_laboral
    GROUP BY id_usuario
)
SELECT
    u.codigo_participante,
    a.nombre::varchar(60) AS area,
    u.cargo::varchar(40) AS cargo,
    t.tipo::varchar(10) AS tipo_turno_predominante,
    r.fecha_aplicacion,
    r.psqi_c1_calidad_subjetiva,
    r.psqi_c2_latencia,
    r.psqi_c3_duracion,
    r.psqi_c4_eficiencia,
    r.psqi_c5_perturbaciones,
    r.psqi_c6_medicacion,
    r.psqi_c7_disfuncion_diurna,
    r.psqi_global,
    r.ess_total,
    r.jetlag_social_h,
    r.cafeina_diaria_mg,
    (time '00:00' + make_interval(mins => round(r.hora_ultima_cafeina_h * 60)::int)) AS hora_ultima_cafeina,
    r.cafeina_residual_mg,
    r.luz_matutina_min
FROM r
JOIN usuario u ON u.id = r.id_usuario AND u.estado = 'activo'
JOIN area a ON a.id = u.id_area
LEFT JOIN t ON t.id_usuario = u.id;
