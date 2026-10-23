import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import {
  CODIGOS_ERROR,
  type AuthTokens,
  type UsuarioDto,
  type UsuarioJwtPayload,
} from '@circadiano/contracts';
import { segundosDeExpira } from '../../../config/entorno';
import { PrismaService } from '../../../prisma/prisma.service';

/** El token de refresco dura lo mismo que el maximo permitido para un JWT (24 h). */
const EXPIRA_REFRESCO_SEGUNDOS = 24 * 60 * 60;

interface RefrescoPayload {
  sub: string;
  tipo: 'refresco';
}

@Injectable()
export class AuthService {
  /** Hash falso para que un correo inexistente tarde lo mismo que uno real. */
  private hashFalso?: Promise<string>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async iniciarSesion(correo: string, clave: string): Promise<AuthTokens> {
    const usuario = await this.prisma.usuario.findUnique({ where: { correo } });
    const hash = usuario?.hashClave ?? (await this.obtenerHashFalso());
    const claveValida = await argon2.verify(hash, clave).catch(() => false);
    if (!usuario || !claveValida || usuario.estado !== 'activo') {
      throw this.credencialesInvalidas();
    }
    return this.emitirTokens(usuario.id, usuario.rol, usuario.codigoParticipante);
  }

  async refrescar(tokenRefresco: string): Promise<AuthTokens> {
    let payload: RefrescoPayload;
    try {
      payload = await this.jwt.verifyAsync<RefrescoPayload>(tokenRefresco, {
        secret: this.secretoRefresco(),
        algorithms: ['HS256'],
      });
    } catch {
      throw this.noAutenticado();
    }
    if (payload.tipo !== 'refresco') throw this.noAutenticado();

    // Se relee al usuario: un retiro o cambio de rol aplica en el siguiente refresco.
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
    });
    if (!usuario || usuario.estado !== 'activo') throw this.noAutenticado();
    return this.emitirTokens(usuario.id, usuario.rol, usuario.codigoParticipante);
  }

  async obtenerPerfil(idUsuario: string): Promise<UsuarioDto> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
    });
    if (!usuario || usuario.estado !== 'activo') throw this.noAutenticado();
    return {
      id: usuario.id,
      codigoParticipante: usuario.codigoParticipante,
      rol: usuario.rol,
      idArea: usuario.idArea,
      cargo: usuario.cargo,
      consentimiento: usuario.consentimiento,
      semividaH: Number(usuario.semividaH),
      fuma: usuario.fuma,
    };
  }

  private async emitirTokens(
    id: string,
    rol: UsuarioJwtPayload['rol'],
    codigoParticipante: string,
  ): Promise<AuthTokens> {
    const acceso: UsuarioJwtPayload = { sub: id, rol, codigoParticipante };
    const refresco: RefrescoPayload = { sub: id, tipo: 'refresco' };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(acceso),
      // Secreto distinto: un token de refresco nunca sirve como token de acceso.
      this.jwt.signAsync(refresco, {
        secret: this.secretoRefresco(),
        expiresIn: EXPIRA_REFRESCO_SEGUNDOS,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
      expiraEnSegundos: segundosDeExpira(
        this.config.get<string>('JWT_EXPIRA'),
      ),
    };
  }

  private secretoRefresco(): string {
    return `${this.config.getOrThrow<string>('JWT_SECRET')}:refresco`;
  }

  private obtenerHashFalso(): Promise<string> {
    this.hashFalso ??= argon2.hash('clave-falsa-para-igualar-tiempos');
    return this.hashFalso;
  }

  private credencialesInvalidas(): UnauthorizedException {
    return new UnauthorizedException({
      code: CODIGOS_ERROR.CREDENCIALES_INVALIDAS,
      message: 'Correo o clave incorrectos',
    });
  }

  private noAutenticado(): UnauthorizedException {
    return new UnauthorizedException({
      code: CODIGOS_ERROR.NO_AUTENTICADO,
      message: 'Token ausente, invalido o vencido',
    });
  }
}
