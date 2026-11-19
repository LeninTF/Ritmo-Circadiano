import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import type {
  AreaDto,
  AuthTokens,
  LoginDto,
  RegistroDto,
  UsuarioDto,
} from '@circadiano/contracts';
import { environment } from '../../environments/environment';
import { DEXIE_DB_TOKEN } from '../core/offline/dexie-db-token';
import { PushService } from '../core/push/push.service';
import { SesionService } from './sesion.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly sesion = inject(SesionService);
  private readonly dexie = inject(DEXIE_DB_TOKEN);
  // PushService exige el service worker: se pide solo al cerrar sesión, no en cada uso del servicio.
  private readonly injector = inject(Injector);
  private readonly base = environment.apiUrl;

  listarAreas(): Observable<AreaDto[]> {
    return this.http.get<AreaDto[]>(`${this.base}/areas`);
  }

  registrar(dto: RegistroDto): Observable<UsuarioDto> {
    return this.http.post<UsuarioDto>(`${this.base}/auth/registro`, dto);
  }

  iniciarSesion(dto: LoginDto): Observable<AuthTokens> {
    return this.http
      .post<AuthTokens>(`${this.base}/auth/login`, dto)
      .pipe(tap((tokens) => this.sesion.iniciar(tokens)));
  }

  refrescar(refreshToken: string): Observable<AuthTokens> {
    return this.http
      .post<AuthTokens>(`${this.base}/auth/refresh`, { refreshToken })
      .pipe(tap((tokens) => this.sesion.iniciar(tokens)));
  }

  perfil(): Observable<UsuarioDto> {
    return this.http.get<UsuarioDto>(`${this.base}/me`);
  }

  /**
   * Cierra sesión sin dejar datos de salud del usuario en el dispositivo (Ley 29733):
   * cancela el push, vacía Dexie (incluido el outbox pendiente) y borra los tokens.
   */
  async cerrarSesion(): Promise<void> {
    try {
      await this.injector.get(PushService).cancelarSuscripcion();
      const db = this.dexie.getDatabase();
      await db.transaction('rw', db.tables, () => Promise.all(db.tables.map((t) => t.clear())));
    } finally {
      // Aunque falle la limpieza, la sesión se cierra igual.
      this.sesion.cerrar();
    }
  }
}
