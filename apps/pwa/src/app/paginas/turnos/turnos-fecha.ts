const MS_DIA = 86_400_000;
// America/Lima es UTC-5 todo el año (sin horario de verano).
const DESFASE_LIMA = '-05:00';

/** Suma días a una fecha YYYY-MM-DD sin pasar por la zona del dispositivo. */
export const sumarDias = (fecha: string, dias: number) =>
  new Date(Date.parse(`${fecha}T00:00:00Z`) + dias * MS_DIA).toISOString().slice(0, 10);

/** Lunes a domingo (YYYY-MM-DD) de la semana que contiene `fecha`. */
export function semanaDe(fecha: string): string[] {
  const diaSemana = new Date(`${fecha}T00:00:00Z`).getUTCDay();
  const lunes = sumarDias(fecha, -((diaSemana + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i));
}

/**
 * Inicio y fin ISO de un turno escrito en hora de Lima. Si la hora de fin no es
 * posterior a la de inicio, el turno termina al día siguiente (turno nocturno).
 */
export function rangoTurnoLima(fecha: string, horaInicio: string, horaFin: string) {
  const fechaFin = horaFin > horaInicio ? fecha : sumarDias(fecha, 1);
  return {
    inicio: new Date(`${fecha}T${horaInicio}:00${DESFASE_LIMA}`).toISOString(),
    fin: new Date(`${fechaFin}T${horaFin}:00${DESFASE_LIMA}`).toISOString(),
  };
}
