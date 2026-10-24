import { BadRequestException, ConflictException } from '@nestjs/common';
import * as argon2 from 'argon2';
import type { RegistroDto } from '@circadiano/contracts';
import { RegistroService } from './registro.service';
import type { PrismaService } from '../../../prisma/prisma.service';

describe('RegistroService (RF01, CP-01)', () => {
  const crear = jest.fn();
  const buscarVarios = jest.fn();
  const buscarArea = jest.fn();
  let servicio: RegistroService;

  const dto = (extra: Partial<RegistroDto> = {}): RegistroDto => ({
    correo: ' Ana@Ejemplo.PE ',
    clave: 'una-clave-larga',
    idArea: 'a-1',
    cargo: 'Conductor',
    consentimiento: true,
    ...extra,
  });

  // Forma real del error con el adaptador de pg (comprobada contra Postgres 16).
  const duplicado = (indice: string) =>
    Object.assign(new Error('duplicado'), {
      code: 'P2002',
      meta: { driverAdapterError: { cause: { constraint: { index: indice } } } },
    });

  beforeEach(() => {
    jest.resetAllMocks();
    buscarArea.mockResolvedValue({ id: 'a-1' });
    buscarVarios.mockResolvedValue([]);
    crear.mockImplementation(({ data }) =>
      Promise.resolve({ id: 'u-1', estado: 'activo', semividaH: '5', fuma: false, ...data }),
    );
    servicio = new RegistroService({
      area: { findUnique: buscarArea },
      usuario: { findMany: buscarVarios, create: crear },
    } as unknown as PrismaService);
  });

  it('sin consentimiento -> 400 y no crea nada (RN11)', async () => {
    await expect(
      servicio.registrar(dto({ consentimiento: false })),
    ).rejects.toMatchObject({
      response: { code: 'consentimiento_requerido' },
    });
    expect(crear).not.toHaveBeenCalled();
    expect(buscarArea).not.toHaveBeenCalled();
  });

  it('crea trabajador con codigo P01, fecha de consentimiento del servidor y clave con Argon2id', async () => {
    const antes = Date.now();
    const usuario = await servicio.registrar(dto());
    const { data } = crear.mock.calls[0][0];
    expect(usuario.codigoParticipante).toBe('P01');
    expect(usuario.rol).toBe('trabajador');
    expect(data.correo).toBe('ana@ejemplo.pe');
    expect(data.fechaConsentimiento.getTime()).toBeGreaterThanOrEqual(antes);
    expect(data.hashClave).toMatch(/^\$argon2id\$/);
    expect(await argon2.verify(data.hashClave, 'una-clave-larga')).toBe(true);
  });

  it('el codigo es correlativo e ignora al administrador A01', async () => {
    buscarVarios.mockResolvedValue([
      { codigoParticipante: 'P01' },
      { codigoParticipante: 'P09' },
    ]);
    const usuario = await servicio.registrar(dto());
    expect(usuario.codigoParticipante).toBe('P10');
    expect(buscarVarios).toHaveBeenCalledWith(
      expect.objectContaining({ where: { codigoParticipante: { startsWith: 'P' } } }),
    );
  });

  it('la respuesta no expone correo ni hash_clave', async () => {
    const usuario = await servicio.registrar(dto());
    expect(usuario).not.toHaveProperty('correo');
    expect(usuario).not.toHaveProperty('hashClave');
  });

  it('area inexistente -> 400', async () => {
    buscarArea.mockResolvedValue(null);
    await expect(servicio.registrar(dto())).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(crear).not.toHaveBeenCalled();
  });

  it('correo repetido -> 409', async () => {
    crear.mockRejectedValue(duplicado('usuario_correo_key'));
    await expect(servicio.registrar(dto())).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('tambien reconoce el duplicado con la forma antigua meta.target', async () => {
    crear.mockRejectedValue(
      Object.assign(new Error('duplicado'), { code: 'P2002', meta: { target: ['correo'] } }),
    );
    await expect(servicio.registrar(dto())).rejects.toBeInstanceOf(ConflictException);
  });

  it('un error que no es de duplicado se propaga tal cual', async () => {
    const fallo = new Error('conexion perdida');
    crear.mockRejectedValue(fallo);
    await expect(servicio.registrar(dto())).rejects.toBe(fallo);
  });

  it('si otro registro toma el mismo codigo, reintenta con el siguiente', async () => {
    crear.mockRejectedValueOnce(duplicado('usuario_codigo_participante_key'));
    buscarVarios
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ codigoParticipante: 'P01' }]);
    const usuario = await servicio.registrar(dto());
    expect(usuario.codigoParticipante).toBe('P02');
    expect(crear).toHaveBeenCalledTimes(2);
  });
});
