import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type {
  BebidaDto,
  CafeinaActivaDto,
  CrearIngestaCafeinaDto,
  IngestaCafeinaRespuestaDto,
  PlanDiarioDto,
  ResumenCafeinaDto,
} from '@circadiano/contracts';
import {
  DESFASE_LIMA_H,
  SEMIVIDA_H_DEFECTO,
  UMBRAL_CAFEINA_MG_DEFECTO,
  ZONA_HORARIA_EMPRESA,
  calcularCafeinaActiva,
  resumirConsumoPorDia,
} from '@circadiano/domain';
import { environment } from '../../../environments/environment';
import { OfflineStoreService } from '../../core/offline/offline-store.service';
import { OutboxService } from '../../core/offline/outbox.service';

/** Lo que el trabajador elige en /cafeina. `bebida: null` es «Otro (indico los mg)». */
export interface RegistroCafeina {
  bebida: BebidaDto | null;
  porciones: number;
  cafeinaMg: number | null;
  /** HH:mm de hoy en la zona del dispositivo. */
  hora: string;
}

/** Lo que se guarda en el campo `data` del store Dexie `ingestas`. */
export interface IngestaLocal {
  clientId: string;
  cafeinaMg: number;
  nombre: string;
}

/** Un consumo de hoy en «Mi consumo». Sin `idIngesta` todavía no está en el servidor. */
export interface ConsumoItem {
  clientId: string;
  idIngesta: number | null;
  nombre: string;
  cafeinaMg: number;
  fechaHora: string;
  pendiente: boolean;
}

export interface MiConsumo {
  resumen: ResumenCafeinaDto;
  items: ConsumoItem[];
  /** true: sin señal, calculado con lo registrado en este teléfono. */
  sinSenal: boolean;
}

type IngestaLocalConFecha = IngestaLocal & { fechaHora: string };

const MS_H = 3_600_000;
// Con señal se espera el envío antes de volver a «Mi consumo», pero nunca más de esto.
const ESPERA_ENVIO_MS = 5_000;
const CLAVE_CACHE_BEBIDAS = 'circaruta.bebidas';
// HU-03: el servidor acepta hasta 5 min en el futuro por relojes desfasados.
const MARGEN_FUTURO_MS = 5 * 60_000;

/** Total en vivo: para el catálogo es una vista previa, el servidor recalcula los mg. */
export function totalMg(registro: RegistroCafeina): number {
  if (registro.bebida) return Math.round(registro.bebida.cafeina_mg * registro.porciones);
  return registro.cafeinaMg ?? 0;
}

/**
 * La última vez que fue esa hora: hoy, o ayer si hoy todavía no llega.
 * Así, a las 00:05, «23:50» es el café de anoche (turnos nocturnos) y nunca queda en el futuro.
 */
export function aFechaReciente(hora: string, ahora: Date): Date {
  const [h, m] = hora.split(':').map(Number);
  const fecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), h, m);
  if (fecha.getTime() > ahora.getTime() + MARGEN_FUTURO_MS) fecha.setDate(fecha.getDate() - 1);
  return fecha;
}

/** YYYY-MM-DD del instante en hora de Lima. */
export const fechaLima = (iso: string) =>
  new Date(Date.parse(iso) + DESFASE_LIMA_H * MS_H).toISOString().slice(0, 10);

const FORMATO_HORA = new Intl.DateTimeFormat('es-PE', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: ZONA_HORARIA_EMPRESA,
});
/** HH:mm de 24 h en hora de Lima. */
export const horaLima = (iso: string) => FORMATO_HORA.format(new Date(iso));

/** Sin señal: el mismo cálculo que el servidor (libs/domain) con lo registrado en este teléfono. */
export function resumenLocal(locales: readonly IngestaLocalConFecha[], ahora: Date, dias = 7): ResumenCafeinaDto {
  const ingestas = locales.map((l) => ({ dosisMg: l.cafeinaMg, hora: Date.parse(l.fechaHora) / MS_H }));
  const ahoraH = ahora.getTime() / MS_H;
  const consumo = resumirConsumoPorDia(ingestas, ahoraH, dias).map((d) => ({ ...d, totalMg: Math.round(d.totalMg) }));
  const activa = calcularCafeinaActiva(ingestas, ahoraH, SEMIVIDA_H_DEFECTO, UMBRAL_CAFEINA_MG_DEFECTO);
  return {
    zonaHoraria: ZONA_HORARIA_EMPRESA,
    dias: consumo,
    hoy: consumo[consumo.length - 1],
    cafeinaActiva: {
      mg: Math.round(activa.mg),
      calculadoEn: ahora.toISOString(),
      horaNivelBajo: activa.horaNivelBajo === null ? null : new Date(activa.horaNivelBajo * MS_H).toISOString(),
      semividaH: SEMIVIDA_H_DEFECTO,
      umbralMg: UMBRAL_CAFEINA_MG_DEFECTO,
      esEstimacion: true,
    },
  };
}

/** Texto de la tarjeta (SPEC §7.1). La hora de corte sale del plan de I3; aquí no se recalcula. */
export function mensajeCafeinaActiva(activa: CafeinaActivaDto, plan: PlanDiarioDto | null): string {
  let nivel = 'Tu cafeína activa está en nivel bajo.';
  if (activa.horaNivelBajo !== null) {
    nivel = plan
      ? `Te quedan ~${activa.mg} mg de cafeína activa.`
      : `Tienes ~${activa.mg} mg de cafeína activa. Bajará a nivel bajo cerca de las ${horaLima(activa.horaNivelBajo)}.`;
  }
  if (!plan) return nivel;
  const corte = plan.horaCorteCafeina
    ? `evita más café después de las ${horaLima(plan.horaCorteCafeina)}`
    : 'evita más café por hoy';
  return `${nivel} Si duermes a las ${horaLima(plan.inicioSueno)}, ${corte}.`;
}

async function esperarConTope(promesa: Promise<unknown>, ms: number): Promise<void> {
  let tope: ReturnType<typeof setTimeout> | undefined;
  await Promise.race([promesa, new Promise((listo) => (tope = setTimeout(listo, ms)))]);
  clearTimeout(tope);
}

const aItemLocal = (l: IngestaLocalConFecha, pendiente: boolean): ConsumoItem => ({
  clientId: l.clientId,
  idIngesta: null,
  nombre: l.nombre,
  cafeinaMg: Math.round(l.cafeinaMg),
  fechaHora: l.fechaHora,
  pendiente,
});
const ordenarRecientes = (items: ConsumoItem[]) =>
  [...items].sort((a, b) => Date.parse(b.fechaHora) - Date.parse(a.fechaHora));

/** Mismas reglas que valida la API, para mostrar el error junto al campo antes de enviar. */
export function errorRegistro(registro: RegistroCafeina): string | null {
  const mg = registro.cafeinaMg;
  if (!registro.bebida && (mg === null || !Number.isInteger(mg) || mg < 1 || mg > 1000)) {
    return 'Indica los mg (entre 1 y 1000).';
  }
  if (!/^\d{2}:\d{2}$/.test(registro.hora)) return 'Indica la hora.';
  return null;
}

@Injectable({ providedIn: 'root' })
export class CafeinaService {
  private readonly http = inject(HttpClient);
  private readonly outbox = inject(OutboxService);
  private readonly store = inject(OfflineStoreService);

  /** Catálogo de GET /bebidas; sin red usa la última copia guardada en el teléfono. */
  async obtenerBebidas(): Promise<BebidaDto[]> {
    try {
      const bebidas = await firstValueFrom(this.http.get<BebidaDto[]>(`${environment.apiUrl}/bebidas`));
      try {
        localStorage.setItem(CLAVE_CACHE_BEBIDAS, JSON.stringify(bebidas));
      } catch {
        // Sin almacenamiento: el catálogo se vuelve a pedir la próxima vez.
      }
      return bebidas;
    } catch {
      try {
        return JSON.parse(localStorage.getItem(CLAVE_CACHE_BEBIDAS) ?? '[]') as BebidaDto[];
      } catch {
        return [];
      }
    }
  }

  /** Encola la ingesta (RNF03); OutboxService la envía a POST /sync/lote al haber red. Devuelve el client_id. */
  async registrar(registro: RegistroCafeina, ahora = new Date()): Promise<string> {
    const fechaHora = aFechaReciente(registro.hora, ahora).toISOString();
    const payload: Omit<CrearIngestaCafeinaDto, 'id_usuario' | 'client_id'> = registro.bebida
      ? { id_bebida: registro.bebida.id_bebida, porciones: registro.porciones, fecha_hora: fechaHora }
      : { cafeina_mg: registro.cafeinaMg ?? undefined, fecha_hora: fechaHora };
    const clientId = await this.outbox.enqueue({ operation: 'ingesta', payload });
    try {
      // El plan offline de I3 lee este store para el corte de cafeína (shortcut en plan.service.ts).
      await this.store.addIngesta({
        fecha: fechaHora,
        data: { clientId, cafeinaMg: totalMg(registro), nombre: registro.bebida?.nombre ?? 'Otro' },
      });
    } catch {
      // Ya está en la cola: fallar aquí haría que el trabajador reintente y la duplique.
    }
    // Así «Mi consumo» ya lo cuenta al volver; sin señal la cola falla rápido y queda pendiente.
    await esperarConTope(this.outbox.sync().catch(() => undefined), ESPERA_ENVIO_MS);
    return clientId;
  }

  /** «Mi consumo» (HU-04): del servidor si hay señal; sin señal, calculado en el teléfono. */
  async obtenerMiConsumo(ahora = new Date()): Promise<MiConsumo> {
    const locales = await this.leerLocales();
    const pendientes = await this.clientIdsPendientes();
    try {
      const resumen = await firstValueFrom(this.http.get<ResumenCafeinaDto>(`${environment.apiUrl}/cafeina/resumen`));
      const [delServidor, bebidas] = await Promise.all([
        firstValueFrom(
          this.http.get<IngestaCafeinaRespuestaDto[]>(`${environment.apiUrl}/cafeina`, {
            params: { fecha: resumen.hoy.fecha },
          }),
        ),
        this.obtenerBebidas(),
      ]);
      const nombres = new Map(bebidas.map((b) => [b.id_bebida, b.nombre]));
      const enServidor = new Set(delServidor.map((i) => i.client_id));
      const items: ConsumoItem[] = delServidor.map((i) => ({
        clientId: i.client_id,
        idIngesta: i.id_ingesta,
        nombre: i.id_bebida === null ? 'Otro' : (nombres.get(i.id_bebida) ?? 'Bebida'),
        cafeinaMg: Math.round(i.cafeina_mg),
        fechaHora: i.fecha_hora,
        pendiente: false,
      }));
      // shortcut: las pendientes se listan pero aún no suman en el resumen del servidor; se ve al sincronizar.
      const enCola = locales.filter(
        (l) => pendientes.has(l.clientId) && !enServidor.has(l.clientId) && fechaLima(l.fechaHora) === resumen.hoy.fecha,
      );
      return { resumen, items: ordenarRecientes([...items, ...enCola.map((l) => aItemLocal(l, true))]), sinSenal: false };
    } catch (error) {
      if (!(error instanceof HttpErrorResponse) || error.status !== 0) throw error;
      const resumen = resumenLocal(locales, ahora);
      const deHoy = locales.filter((l) => fechaLima(l.fechaHora) === resumen.hoy.fecha);
      return {
        resumen,
        items: ordenarRecientes(deHoy.map((l) => aItemLocal(l, pendientes.has(l.clientId)))),
        sinSenal: true,
      };
    }
  }

  /** HU-05: solo registros ya enviados; el servidor responde 404 si no son del trabajador. */
  async eliminar(item: ConsumoItem): Promise<void> {
    if (item.idIngesta === null) throw new Error('El registro todavía no está en el servidor');
    await firstValueFrom(this.http.delete(`${environment.apiUrl}/cafeina/${item.idIngesta}`));
    try {
      await this.store.removeIngestaPorClientId(item.clientId);
    } catch {
      // La copia local solo alimenta el modo sin señal.
    }
  }

  private async leerLocales(): Promise<IngestaLocalConFecha[]> {
    const filas = await this.store.getMyIngestas();
    return filas.flatMap((fila) => {
      const data = fila.data as Partial<IngestaLocal> | undefined;
      if (typeof data?.clientId !== 'string' || typeof data.cafeinaMg !== 'number') return [];
      return [{ clientId: data.clientId, cafeinaMg: data.cafeinaMg, nombre: data.nombre ?? 'Otro', fechaHora: fila.fecha }];
    });
  }

  private async clientIdsPendientes(): Promise<Set<string>> {
    const cola = await this.store.getPendingOutbox();
    return new Set(cola.filter((o) => o.operation === 'ingesta').map((o) => o.clientId));
  }
}
