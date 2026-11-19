import {
  CONDUCCION_MAX_DIURNA_H,
  CONDUCCION_MAX_NOCTURNA_H,
  CONDUCCION_MAX_ACUMULADA_H,
  CONDUCCION_VENTANA_H,
  HORA_INICIO_NOCTURNO,
  HORA_FIN_NOCTURNO,
  DESFASE_LIMA_H,
} from './constantes';

/** Hora del reloj en America/Lima, sin depender de la zona horaria del servidor. */
export function horaLima(fecha: Date): number {
  return (fecha.getUTCHours() + DESFASE_LIMA_H + 24) % 24;
}

/** Bloque continuo de conduccion: empieza en `inicio` (ISO) y dura `horas` (RN01). */
export interface BloqueConduccion {
  inicio: string;
  horas: number;
}

export interface ValidacionJornadaInput {
  nuevo: BloqueConduccion;
  /** Otros turnos del trabajador (sin el nuevo): solo cuentan los que caen cerca. */
  previos: BloqueConduccion[];
  esNocturno?: boolean;
}

export interface ValidacionJornadaResultado {
  superaContinuo: boolean;
  superaVentana: boolean;
  limiteContinuo: number;
  limiteVentana: number;
  /** Maximo de horas conducidas en cualquier ventana de 24 h que toque el turno nuevo. */
  horasVentana24h: number;
}

const MS_H = 3_600_000;

function horasEnVentana(bloques: { ini: number; fin: number }[], desde: number): number {
  const hasta = desde + CONDUCCION_VENTANA_H * MS_H;
  return bloques.reduce((acc, b) => acc + Math.max(0, Math.min(b.fin, hasta) - Math.max(b.ini, desde)), 0) / MS_H;
}

/**
 * RN01: max. 4 h continuas si el tramo es nocturno, 5 h si es diurno, y max. 10 h
 * en cualquier ventana movil de 24 h (no por dia calendario).
 */
export function validarJornadaRN01(input: ValidacionJornadaInput): ValidacionJornadaResultado {
  const limiteContinuo = input.esNocturno ? CONDUCCION_MAX_NOCTURNA_H : CONDUCCION_MAX_DIURNA_H;
  const aBloque = (b: BloqueConduccion) => {
    const ini = Date.parse(b.inicio);
    return { ini, fin: ini + b.horas * MS_H };
  };
  const nuevo = aBloque(input.nuevo);
  const bloques = [nuevo, ...input.previos.map(aBloque)];
  const ventanaMs = CONDUCCION_VENTANA_H * MS_H;
  // La suma es lineal por tramos: su maximo cae cuando la ventana empieza en un inicio
  // de bloque o termina en un fin de bloque. Solo importan las ventanas que tocan el nuevo.
  const candidatos = bloques
    .flatMap((b) => [b.ini, b.fin - ventanaMs])
    .filter((s) => s < nuevo.fin && s + ventanaMs > nuevo.ini);
  const maximo = Math.max(0, ...candidatos.map((s) => horasEnVentana(bloques, s)));
  // Redondeo a centesimas: 3.1 + 6.9 no debe salir 10.000000001 y disparar un 409.
  const horasVentana24h = Math.round(maximo * 100) / 100;

  return {
    superaContinuo: input.nuevo.horas > limiteContinuo,
    superaVentana: horasVentana24h > CONDUCCION_MAX_ACUMULADA_H,
    limiteContinuo,
    limiteVentana: CONDUCCION_MAX_ACUMULADA_H,
    horasVentana24h,
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

  const horaInicio = horaLima(inicio);
  const horaFin = horaLima(fin);

  const esHoraNocturna = (h: number) => h >= HORA_INICIO_NOCTURNO || h < HORA_FIN_NOCTURNO;

  if (esHoraNocturna(horaInicio) || esHoraNocturna(horaFin)) {
    return true;
  }

  const duracionMs = fin.getTime() - inicio.getTime();
  if (duracionMs <= 0) return false;

  let current = new Date(inicio);
  while (current < fin) {
    const h = horaLima(current);
    if (esHoraNocturna(h)) {
      return true;
    }
    current = new Date(current.getTime() + 60 * 60 * 1000);
  }

  return false;
}
