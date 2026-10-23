import { randomBytes } from 'node:crypto';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service';
import type { PrismaService } from '../../../prisma/prisma.service';

const SECRETO = randomBytes(32).toString('hex');

describe('AuthService', () => {
  let servicio: AuthService;
  let jwt: JwtService;
  const buscar = jest.fn();
  let usuario: Record<string, unknown>;

  beforeAll(async () => {
    usuario = {
      id: 'u-1',
      correo: 'ana@ejemplo.pe',
      hashClave: await argon2.hash('clave-correcta'),
      rol: 'trabajador',
      codigoParticipante: 'P01',
      idArea: 'a-1',
      cargo: 'Conductor',
      consentimiento: true,
      semividaH: 5,
      fuma: false,
      estado: 'activo',
    };
  });

  beforeEach(() => {
    buscar.mockReset();
    jwt = new JwtService({ secret: SECRETO, signOptions: { expiresIn: 3600 } });
    const config = {
      get: (k: string) => (k === 'JWT_EXPIRA' ? '1h' : undefined),
      getOrThrow: () => SECRETO,
    } as unknown as ConfigService;
    servicio = new AuthService(
      { usuario: { findUnique: buscar } } as unknown as PrismaService,
      jwt,
      config,
    );
  });

  it('login correcto devuelve tokens y el acceso trae rol y codigo', async () => {
    buscar.mockResolvedValue(usuario);
    const tokens = await servicio.iniciarSesion('ana@ejemplo.pe', 'clave-correcta');
    expect(tokens.expiraEnSegundos).toBe(3600);
    const payload = await jwt.verifyAsync(tokens.accessToken);
    expect(payload).toMatchObject({
      sub: 'u-1',
      rol: 'trabajador',
      codigoParticipante: 'P01',
    });
    expect(payload).not.toHaveProperty('correo');
  });

  it('clave incorrecta -> 401 credenciales_invalidas', async () => {
    buscar.mockResolvedValue(usuario);
    await expect(
      servicio.iniciarSesion('ana@ejemplo.pe', 'otra'),
    ).rejects.toMatchObject({
      response: { code: 'credenciales_invalidas' },
    });
  });

  it('correo inexistente da el mismo error que clave incorrecta', async () => {
    buscar.mockResolvedValue(null);
    await expect(
      servicio.iniciarSesion('nadie@ejemplo.pe', 'x'),
    ).rejects.toMatchObject({
      response: { code: 'credenciales_invalidas' },
    });
  });

  it('usuario retirado no inicia sesion', async () => {
    buscar.mockResolvedValue({ ...usuario, estado: 'retirado' });
    await expect(
      servicio.iniciarSesion('ana@ejemplo.pe', 'clave-correcta'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('refresh valido emite tokens nuevos', async () => {
    buscar.mockResolvedValue(usuario);
    const { refreshToken } = await servicio.iniciarSesion(
      'ana@ejemplo.pe',
      'clave-correcta',
    );
    const nuevos = await servicio.refrescar(refreshToken);
    expect(nuevos.accessToken).toBeDefined();
  });

  it('el token de acceso no sirve como refresco', async () => {
    buscar.mockResolvedValue(usuario);
    const { accessToken } = await servicio.iniciarSesion(
      'ana@ejemplo.pe',
      'clave-correcta',
    );
    await expect(servicio.refrescar(accessToken)).rejects.toMatchObject({
      response: { code: 'no_autenticado' },
    });
  });

  it('el token de refresco no sirve como acceso', async () => {
    buscar.mockResolvedValue(usuario);
    const { refreshToken } = await servicio.iniciarSesion(
      'ana@ejemplo.pe',
      'clave-correcta',
    );
    await expect(jwt.verifyAsync(refreshToken)).rejects.toBeDefined();
  });

  it('refresh de usuario retirado -> 401', async () => {
    buscar.mockResolvedValue(usuario);
    const { refreshToken } = await servicio.iniciarSesion(
      'ana@ejemplo.pe',
      'clave-correcta',
    );
    buscar.mockResolvedValue({ ...usuario, estado: 'retirado' });
    await expect(servicio.refrescar(refreshToken)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('el perfil no expone correo ni hash_clave', async () => {
    buscar.mockResolvedValue(usuario);
    const perfil = await servicio.obtenerPerfil('u-1');
    expect(perfil).not.toHaveProperty('correo');
    expect(perfil).not.toHaveProperty('hashClave');
    expect(perfil.semividaH).toBe(5);
  });
});
