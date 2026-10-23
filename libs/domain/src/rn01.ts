import {
  CONDUCCION_MAX_DIURNA_H,
  CONDUCCION_MAX_NOCTURNA_H,
  CONDUCCION_MAX_ACUMULADA_H,
  HORA_INICIO_NOCTURNO,
  HORA_FIN_NOCTURNO,
} from './constantes';

export interface ValidacionJornadaInput {
  horasConduccion: number;
  horasAcumuladasDia: number;
  esNocturno?: boolean;
}

export interface ValidacionJornadaResultado {
  superaContinuo: boolean;
  superaDiario: boolean;
  limiteContinuo: number;
  limiteDiario: number;
  horasTotalesDia: number;
}

/**
 * Valida las reglas de jornada máxima y límites circadianos (RN01).
 */
export function validarJornadaRN01(input: ValidacionJornadaInput): ValidacionJornadaResultado {
  const limiteContinuo = input.esNocturno ? CONDUCCION_MAX_NOCTURNA_H : CONDUCCION_MAX_DIURNA_H;
  const limiteDiario = CONDUCCION_MAX_ACUMULADA_H;

  const superaContinuo = input.horasConduccion > limiteContinuo;
  const superaDiario = input.horasAcumuladasDia > limiteDiario;

  return {
    superaContinuo,
    superaDiario,
    limiteContinuo,
    limiteDiario,
    horasTotalesDia: input.horasAcumuladasDia,
  };
}

export interface ValidacionDescansoResultado {
  horasDescanso: number;
  esSuficiente: boolean;
  minRequerido: number;
}

/**
 * Valida el descanso mínimo obligatorio entre turnos sucesivos (RN01 / circadiano).
 */
export function validarDescansoMinimo(
  finTurnoAnteriorIso: string,
  inicioTurnoNuevoIso: string,
  minHorasDescanso = 11,
): ValidacionDescansoResultado {
  const finAnterior = new Date(finTurnoAnteriorIso).getTime();
  const inicioNuevo = new Date(inicioTurnoNuevoIso).getTime();

  const diffMs = inicioNuevo - finAnterior;
  const horasDescanso = diffMs > 0 ? diffMs / (1000 * 60 * 60) : 0;
  const esSuficiente = horasDescanso >= minHorasDescanso;

  return {
    horasDescanso,
    esSuficiente,
    minRequerido: minHorasDescanso,
  };
}

/**
 * Detecta si un turno (por marcas temporales ISO) intersecta la franja nocturna (22:00 - 05:59).
 */
export function detectarTurnoNocturno(inicioIso: string, finIso: string): boolean {
  const inicio = new Date(inicioIso);
  const fin = new Date(finIso);

  if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
    return false;
  }

  const horaInicio = inicio.getHours();
  const horaFin = fin.getHours();

  const esHoraNocturna = (h: number) => h >= HORA_INICIO_NOCTURNO || h < HORA_FIN_NOCTURNO;

  if (esHoraNocturna(horaInicio) || esHoraNocturna(horaFin)) {
    return true;
  }

  const duracionMs = fin.getTime() - inicio.getTime();
  if (duracionMs <= 0) return false;

  let current = new Date(inicio);
  while (current < fin) {
    const h = current.getHours();
    if (esHoraNocturna(h)) {
      return true;
    }
    current = new Date(current.getTime() + 60 * 60 * 1000);
  }

  return false;
}
