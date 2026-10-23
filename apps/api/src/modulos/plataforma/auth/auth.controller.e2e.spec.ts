import { randomBytes } from 'node:crypto';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegistroService } from './registro.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

const tokens = { accessToken: 'a', refreshToken: 'r', expiraEnSegundos: 60 };

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const servicio = {
    iniciarSesion: jest.fn().mockResolvedValue(tokens),
    refrescar: jest.fn().mockResolvedValue(tokens),
    obtenerPerfil: jest.fn(),
  };

  const registro = { registrar: jest.fn().mockResolvedValue({ codigoParticipante: 'P01' }) };

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: randomBytes(32).toString('hex') })],
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: servicio },
        { provide: RegistroService, useValue: registro },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
      ],
    }).compile();
    app = modulo.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  afterAll(() => app.close());

  it('POST /auth/login es publico y devuelve 200 con tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ correo: 'ana@ejemplo.pe', clave: 'x' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(tokens);
  });

  it('POST /auth/login con correo invalido -> 400', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ correo: 'no-es-correo', clave: 'x' });
    expect(res.status).toBe(400);
  });

  it('POST /auth/refresh sin cuerpo -> 400', async () => {
    const res = await request(app.getHttpServer()).post('/auth/refresh').send({});
    expect(res.status).toBe(400);
  });

  it('POST /auth/registro es publico y devuelve 201', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/registro')
      .send({
        correo: 'ana@ejemplo.pe',
        clave: 'una-clave-larga',
        idArea: '3f2504e0-4f89-41d3-9a0c-0305e82c3301',
        consentimiento: true,
      });
    expect(res.status).toBe(201);
  });

  it('POST /auth/registro con clave corta o campo ajeno -> 400', async () => {
    const base = {
      correo: 'ana@ejemplo.pe',
      idArea: '3f2504e0-4f89-41d3-9a0c-0305e82c3301',
      consentimiento: true,
    };
    const corta = await request(app.getHttpServer())
      .post('/auth/registro')
      .send({ ...base, clave: 'corta' });
    const ajeno = await request(app.getHttpServer())
      .post('/auth/registro')
      .send({ ...base, clave: 'una-clave-larga', rol: 'administrador' });
    expect(corta.status).toBe(400);
    expect(ajeno.status).toBe(400);
  });

  it('GET /me sin token -> 401', async () => {
    const res = await request(app.getHttpServer()).get('/me');
    expect(res.status).toBe(401);
  });
});
