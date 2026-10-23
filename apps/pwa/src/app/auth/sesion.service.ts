import { Injectable, computed, signal } from '@angular/core';
import type { AuthTokens, Rol, UsuarioJwtPayload } from '@circadiano/contracts';

const CLAVE_SESION = 'gestor-circadiano-sesion';

interface TokensGuardados {
  accessToken: string;
  refreshToken: string;
}

type PayloadJwt = Partial<UsuarioJwtPayload> & { exp?: number };

/** Lee el payload sin verificar la firma: solo sirve para la interfaz, el servidor decide. */
export function decodificarJwt(token: string): PayloadJwt | null {
  try {
    const cuerpo = token.split('.')[1];
    if (!cuerpo) return null;
    const base64 = cuerpo.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as PayloadJwt;
  } catch {
    return null;
  }
}

function estaVigente(token: string, ahoraMs: number): boolean {
  const exp = decodificarJwt(token)?.exp;
  return exp !== undefined && exp * 1000 > ahoraMs;
}

/**
 * Guarda los tokens en localStorage para que el trabajador siga con sesion sin
 * conexion (RNF03). Si el navegador bloquea el almacenamiento, la sesion vive en memoria.
 */
@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly tokens = signal<TokensGuardados | null>(this.leer());

  readonly accessToken = computed(() => this.tokens()?.accessToken ?? null);
  readonly refreshToken = computed(() => this.tokens()?.refreshToken ?? null);
  readonly rol = computed<Rol | null>(() => {
    const token = this.tokens()?.accessToken;
    return (token && decodificarJwt(token)?.rol) || null;
  });
  readonly codigoParticipante = computed(() => {
    const token = this.tokens()?.accessToken;
    return (token && decodificarJwt(token)?.codigoParticipante) || null;
  });

  /** Hay sesion mientras el token de refresco siga vigente (el de acceso se renueva solo). */
  estaAutenticada(ahoraMs = Date.now()): boolean {
    const refresco = this.tokens()?.refreshToken;
    return refresco !== undefined && estaVigente(refresco, ahoraMs);
  }

  iniciar(respuesta: AuthTokens): void {
    const nuevos = {
      accessToken: respuesta.accessToken,
      refreshToken: respuesta.refreshToken,
    };
    this.tokens.set(nuevos);
    this.escribir(nuevos);
  }

  cerrar(): void {
    this.tokens.set(null);
    this.escribir(null);
  }

  private leer(): TokensGuardados | null {
    try {
      const crudo = localStorage.getItem(CLAVE_SESION);
      if (!crudo) return null;
      const datos = JSON.parse(crudo) as Partial<TokensGuardados>;
      return typeof datos.accessToken === 'string' &&
        typeof datos.refreshToken === 'string'
        ? { accessToken: datos.accessToken, refreshToken: datos.refreshToken }
        : null;
    } catch {
      return null;
    }
  }

  private escribir(tokens: TokensGuardados | null): void {
    try {
      if (tokens) localStorage.setItem(CLAVE_SESION, JSON.stringify(tokens));
      else localStorage.removeItem(CLAVE_SESION);
    } catch {
      // Sin almacenamiento local la sesion dura lo que dure la pestana.
    }
  }
}
