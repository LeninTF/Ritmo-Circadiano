import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import type {
  AreaDto,
  AuthTokens,
  LoginDto,
  RegistroDto,
  UsuarioDto,
} from '@circadiano/contracts';
import { environment } from '../../environments/environment';
import { SesionService } from './sesion.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly sesion = inject(SesionService);
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

  cerrarSesion(): void {
    this.sesion.cerrar();
  }
}
