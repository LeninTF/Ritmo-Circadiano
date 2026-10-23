/** Fases del estudio (evaluacion.fase). */
export const FASES_EVALUACION = ['pretest', 'postest'] as const;
export type FaseEvaluacion = (typeof FASES_EVALUACION)[number];

/** resultado_indicador.codigo_indicador -> columna de base_datos_pretest (Anexo 6, Tabla 28). */
export const CODIGOS_INDICADOR = {
  PSQI_C1: 'psqi_c1_calidad_subjetiva',
  PSQI_C2: 'psqi_c2_latencia',
  PSQI_C3: 'psqi_c3_duracion',
  PSQI_C4: 'psqi_c4_eficiencia',
  PSQI_C5: 'psqi_c5_perturbaciones',
  PSQI_C6: 'psqi_c6_medicacion',
  PSQI_C7: 'psqi_c7_disfuncion_diurna',
  PSQI_G: 'psqi_global',
  ESS: 'ess_total',
  JETLAG: 'jetlag_social_h',
  CAF_DIA: 'cafeina_diaria_mg',
  /** Hora decimal (15.5 = 15:30). */
  CAF_ULT: 'hora_ultima_cafeina',
  CAF_RES: 'cafeina_residual_mg',
  LUZ_MAT: 'luz_matutina_min',
} as const;

/**
 * Columnas del CSV de RF16, en orden. Es una lista cerrada: el test anti-PII
 * falla si aparece correo, hash_clave o un nombre.
 */
export const COLUMNAS_EXPORTACION = [
  'codigo_participante',
  'area',
  'cargo',
  'tipo_turno_predominante',
  'fecha_aplicacion',
  ...Object.values(CODIGOS_INDICADOR),
  'notificaciones_abiertas_pct',
] as const;
export type ColumnaExportacion = (typeof COLUMNAS_EXPORTACION)[number];
