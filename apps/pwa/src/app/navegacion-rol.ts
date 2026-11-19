import type { Rol } from '@circadiano/contracts';

export type IconoPestana = 'hoy' | 'cafeina' | 'presalida' | 'diario' | 'turnos' | 'indicadores' | 'despacho' | 'cuenta';

export interface Pestana {
  ruta: string;
  texto: string;
  icono: IconoPestana;
}

/** Pantalla de inicio de cada rol tras ingresar. */
export const INICIO_POR_ROL: Record<Rol, string> = {
  trabajador: '/plan',
  jefe_operaciones: '/turnos',
  despachador: '/despacho',
  administrador: '/plataforma',
};

const PESTANAS_TRABAJADOR: Pestana[] = [
  { ruta: '/plan', texto: 'Hoy', icono: 'hoy' },
  { ruta: '/cafeina', texto: 'Cafeína', icono: 'cafeina' },
  { ruta: '/aptitud', texto: 'Pre-salida', icono: 'presalida' },
  { ruta: '/diario', texto: 'Diario', icono: 'diario' },
];

/** Tab bar de cada rol: solo pantallas que su rol puede abrir (los guards y la API deciden igual). */
export const PESTANAS_POR_ROL: Record<Rol, Pestana[]> = {
  trabajador: PESTANAS_TRABAJADOR,
  jefe_operaciones: [
    { ruta: '/turnos', texto: 'Turnos', icono: 'turnos' },
    { ruta: '/indicadores', texto: 'Indicadores', icono: 'indicadores' },
  ],
  despachador: [
    { ruta: '/despacho', texto: 'Despacho', icono: 'despacho' },
    { ruta: '/turnos', texto: 'Turnos', icono: 'turnos' },
  ],
  administrador: [
    { ruta: '/plataforma', texto: 'Plataforma', icono: 'cuenta' },
    { ruta: '/turnos', texto: 'Turnos', icono: 'turnos' },
  ],
};

/** Sin sesión se muestran las pestañas del trabajador: cada una lleva a /ingresar. */
export const pestanasDe = (rol: Rol | null): Pestana[] => (rol ? PESTANAS_POR_ROL[rol] : PESTANAS_TRABAJADOR);
