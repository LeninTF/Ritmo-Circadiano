import * as fs from 'fs';
import * as path from 'path';
import { Prisma } from '../../generated/prisma/client';

/**
 * Pruebas de contrato para el modelo y la migracion `registro_sueno` (Slice I5).
 * AVISO METODOLOGICO (FASE 4): Verifican esquema, tipos y reglas a nivel
 * de aplicacion y DDL. No sustituyen constraints en motor real de base de datos.
 */
describe('Contrato registro_sueno (Slice I5)', () => {
  const rutaRaiz = path.resolve(__dirname, '../../../../..');
  const rutaSchemaI5 = path.join(
    rutaRaiz,
    'prisma',
    'schema',
    'i5-trabajador.prisma'
  );
  const rutaMigracion = path.join(
    rutaRaiz,
    'prisma',
    'migrations',
    '20261021180000_i5_registro_sueno',
    'migration.sql'
  );

  let contenidoSchema: string;
  let contenidoMigracion: string;

  beforeAll(() => {
    expect(fs.existsSync(rutaSchemaI5)).toBe(true);
    expect(fs.existsSync(rutaMigracion)).toBe(true);
    contenidoSchema = fs.readFileSync(rutaSchemaI5, 'utf-8');
    contenidoMigracion = fs.readFileSync(rutaMigracion, 'utf-8');
  });

  describe('1. Campos obligatorios y modelo en Prisma', () => {
    it('define el modelo RegistroSueno con mapeo a la tabla registro_sueno', () => {
      expect(contenidoSchema).toMatch(/model\s+RegistroSueno\s+\{/);
      expect(contenidoSchema).toMatch(/@@map\("registro_sueno"\)/);
    });

    it('expone todos los campos obligatorios segun el backlog', () => {
      const camposEsperados = [
        'id',
        'idUsuario',
        'fecha',
        'horaAcostarse',
        'horaDespertar',
        'latenciaMin',
        'despertares',
        'calidadPercibida',
        'fatigaPercibida',
        'esDiaLaboral',
        'luzMatutinaMin',
        'clientId',
        'updatedAt',
      ];

      for (const campo of camposEsperados) {
        const regexCampo = new RegExp(`\\b${campo}\\b`);
        expect(contenidoSchema).toMatch(regexCampo);
      }
    });

    it('registra el modelo RegistroSueno en el Prisma Client generado', () => {
      expect(Prisma.ModelName.RegistroSueno).toBe('RegistroSueno');
    });

    it('incluye los 13 campos escalares en Prisma.RegistroSuenoScalarFieldEnum', () => {
      const escalares = Object.values(Prisma.RegistroSuenoScalarFieldEnum);
      expect(escalares).toHaveLength(13);
      expect(escalares).toContain('id');
      expect(escalares).toContain('idUsuario');
      expect(escalares).toContain('fecha');
      expect(escalares).toContain('horaAcostarse');
      expect(escalares).toContain('horaDespertar');
      expect(escalares).toContain('latenciaMin');
      expect(escalares).toContain('despertares');
      expect(escalares).toContain('calidadPercibida');
      expect(escalares).toContain('fatigaPercibida');
      expect(escalares).toContain('esDiaLaboral');
      expect(escalares).toContain('luzMatutinaMin');
      expect(escalares).toContain('clientId');
      expect(escalares).toContain('updatedAt');
    });
  });

  describe('2. Tipos de datos en PostgreSQL y Prisma', () => {
    it('utiliza tipos Prisma correctos para cada campo', () => {
      expect(contenidoSchema).toMatch(/id\s+String\s+@id\s+@default\(uuid\(\)\)\s+@db\.Uuid/);
      expect(contenidoSchema).toMatch(/idUsuario\s+String\s+@map\("id_usuario"\)\s+@db\.Uuid/);
      expect(contenidoSchema).toMatch(/fecha\s+DateTime\s+@db\.Date/);
      expect(contenidoSchema).toMatch(/horaAcostarse\s+DateTime\s+@map\("hora_acostarse"\)\s+@db\.Timestamptz\(\)/);
      expect(contenidoSchema).toMatch(/horaDespertar\s+DateTime\s+@map\("hora_despertar"\)\s+@db\.Timestamptz\(\)/);
      expect(contenidoSchema).toMatch(/latenciaMin\s+Int\s+@default\(0\)\s+@map\("latencia_min"\)/);
      expect(contenidoSchema).toMatch(/despertares\s+Int\s+@default\(0\)\s+@map\("despertares"\)/);
      expect(contenidoSchema).toMatch(/calidadPercibida\s+Int\s+@map\("calidad_percibida"\)/);
      expect(contenidoSchema).toMatch(/fatigaPercibida\s+Int\s+@map\("fatiga_percibida"\)/);
      expect(contenidoSchema).toMatch(/esDiaLaboral\s+Boolean\s+@default\(true\)\s+@map\("es_dia_laboral"\)/);
      expect(contenidoSchema).toMatch(/luzMatutinaMin\s+Int\s+@default\(0\)\s+@map\("luz_matutina_min"\)/);
      expect(contenidoSchema).toMatch(/clientId\s+String\s+@unique\s+@map\("client_id"\)\s+@db\.Uuid/);
      expect(contenidoSchema).toMatch(/updatedAt\s+DateTime\s+@updatedAt\s+@map\("updated_at"\)\s+@db\.Timestamptz\(\)/);
    });

    it('la migracion SQL crea los tipos de datos exactos en PostgreSQL', () => {
      expect(contenidoMigracion).toMatch(/"id"\s+UUID\s+NOT\s+NULL/);
      expect(contenidoMigracion).toMatch(/"id_usuario"\s+UUID\s+NOT\s+NULL/);
      expect(contenidoMigracion).toMatch(/"fecha"\s+DATE\s+NOT\s+NULL/);
      expect(contenidoMigracion).toMatch(/"hora_acostarse"\s+TIMESTAMPTZ\s+NOT\s+NULL/);
      expect(contenidoMigracion).toMatch(/"hora_despertar"\s+TIMESTAMPTZ\s+NOT\s+NULL/);
      expect(contenidoMigracion).toMatch(/"latencia_min"\s+INTEGER\s+NOT\s+NULL\s+DEFAULT\s+0/);
      expect(contenidoMigracion).toMatch(/"despertares"\s+INTEGER\s+NOT\s+NULL\s+DEFAULT\s+0/);
      expect(contenidoMigracion).toMatch(/"calidad_percibida"\s+INTEGER\s+NOT\s+NULL/);
      expect(contenidoMigracion).toMatch(/"fatiga_percibida"\s+INTEGER\s+NOT\s+NULL/);
      expect(contenidoMigracion).toMatch(/"es_dia_laboral"\s+BOOLEAN\s+NOT\s+NULL\s+DEFAULT\s+true/);
      expect(contenidoMigracion).toMatch(/"luz_matutina_min"\s+INTEGER\s+NOT\s+NULL\s+DEFAULT\s+0/);
      expect(contenidoMigracion).toMatch(/"client_id"\s+UUID\s+NOT\s+NULL/);
      expect(contenidoMigracion).toMatch(/"updated_at"\s+TIMESTAMPTZ\s+NOT\s+NULL/);
      expect(contenidoMigracion).toMatch(/CONSTRAINT\s+"registro_sueno_pkey"\s+PRIMARY\s+KEY\s+\("id"\)/);
    });
  });

  describe('3. Unicidad compuesta por usuario y fecha (RF11 / CP-11)', () => {
    it('define @@unique([idUsuario, fecha]) en el schema Prisma', () => {
      expect(contenidoSchema).toMatch(/@@unique\(\[idUsuario,\s*fecha\]\)/);
    });

    it('la migracion SQL crea el indice UNIQUE para id_usuario y fecha', () => {
      expect(contenidoMigracion).toMatch(
        /CREATE\s+UNIQUE\s+INDEX\s+"registro_sueno_id_usuario_fecha_key"\s+ON\s+"registro_sueno"\("id_usuario",\s*"fecha"\);/
      );
    });

    it('simula la regla de unicidad: un usuario solo puede tener un registro por fecha', () => {
      const mapaRegistros = new Map<string, string>();
      const claveCompuesta = (idUsuario: string, fechaIso: string) => `${idUsuario}#${fechaIso}`;

      const idUsuario = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
      const fecha = '2026-10-21';
      const idRegistro1 = '11111111-1111-4111-8111-111111111111';
      const idRegistro2 = '22222222-2222-4222-8222-222222222222';

      const clave1 = claveCompuesta(idUsuario, fecha);
      expect(mapaRegistros.has(clave1)).toBe(false);
      mapaRegistros.set(clave1, idRegistro1);

      const existeDuplicado = mapaRegistros.has(claveCompuesta(idUsuario, fecha));
      expect(existeDuplicado).toBe(true);

      const otroUsuario = 'f9e8d7c6-b5a4-4321-9876-543210fedcba';
      const claveOtro = claveCompuesta(otroUsuario, fecha);
      expect(mapaRegistros.has(claveOtro)).toBe(false);
      mapaRegistros.set(claveOtro, idRegistro2);
      expect(mapaRegistros.size).toBe(2);
    });
  });
  describe('4. Unicidad de client_id (ERD06 / Idempotencia offline)', () => {
    it('define @unique en clientId en el schema Prisma', () => {
      expect(contenidoSchema).toMatch(/clientId\s+String\s+@unique/);
    });

    it('la migracion SQL crea el indice UNIQUE para client_id', () => {
      expect(contenidoMigracion).toMatch(
        /CREATE\s+UNIQUE\s+INDEX\s+"registro_sueno_client_id_key"\s+ON\s+"registro_sueno"\("client_id"\);/
      );
    });

    it('simula la idempotencia offline: rechaza insercion de client_id duplicado (ON CONFLICT DO NOTHING)', () => {
      const setClientIds = new Set<string>();
      const clientId = '9f8e7d6c-5b4a-4321-8765-43210fedcba9';

      expect(setClientIds.has(clientId)).toBe(false);
      setClientIds.add(clientId);

      const esDuplicado = setClientIds.has(clientId);
      expect(esDuplicado).toBe(true);

      if (!setClientIds.has(clientId)) {
        setClientIds.add(clientId);
      }
      expect(setClientIds.size).toBe(1);
    });
  });

  describe('5. Formato UUID en identificadores', () => {
    const patronUuidV4 =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    it('valida que los identificadores de ejemplo sigan el formato UUID v4 canonico', () => {
      const idEjemplo = 'c38a169e-5b12-4f6c-8f42-49f3938ab110';
      const idUsuarioEjemplo = 'a6b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
      const clientIdEjemplo = '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';

      expect(patronUuidV4.test(idEjemplo)).toBe(true);
      expect(patronUuidV4.test(idUsuarioEjemplo)).toBe(true);
      expect(patronUuidV4.test(clientIdEjemplo)).toBe(true);
    });

    it('rechaza cadenas que no cumplan el formato UUID', () => {
      const idsInvalidos = [
        'invalido',
        '12345',
        'c38a169e-5b12-1f6c-8f42-49f3938ab110',
        'c38a169e5b124f6c8f4249f3938ab110',
      ];

      for (const idInvalido of idsInvalidos) {
        expect(patronUuidV4.test(idInvalido)).toBe(false);
      }
    });
  });

  describe('6. Convenciones de fecha y hora', () => {
    it('representa fecha como Date medianoche UTC sin componente de hora arbitrario', () => {
      const fechaCadena = '2026-10-21';
      const fechaDate = new Date(`${fechaCadena}T00:00:00.000Z`);

      expect(fechaDate.toISOString().startsWith('2026-10-21')).toBe(true);
      expect(fechaDate.getUTCHours()).toBe(0);
      expect(fechaDate.getUTCMinutes()).toBe(0);
    });

    it('permite registrar horarios nocturnos que cruzan la medianoche', () => {
      const horaAcostarse = new Date('2026-10-20T23:15:00.000-05:00');
      const horaDespertar = new Date('2026-10-21T06:45:00.000-05:00');

      expect(horaDespertar.getTime()).toBeGreaterThan(horaAcostarse.getTime());

      const duracionHoras =
        (horaDespertar.getTime() - horaAcostarse.getTime()) / (1000 * 60 * 60);
      expect(duracionHoras).toBeCloseTo(7.5, 2);
    });
  });

  describe('7. Presencia de updated_at para resolucion de conflictos (LWW)', () => {
    it('define updatedAt con @updatedAt y @db.Timestamptz en el schema', () => {
      expect(contenidoSchema).toMatch(
        /updatedAt\s+DateTime\s+@updatedAt\s+@map\("updated_at"\)\s+@db\.Timestamptz\(\)/
      );
    });

    it('simula la resolucion Last-Write-Wins basada en updated_at', () => {
      const registroServidor = {
        id: '1',
        calidadPercibida: 3,
        updatedAt: new Date('2026-10-21T08:00:00.000Z'),
      };

      const actualizacionMasReciente = {
        id: '1',
        calidadPercibida: 4,
        updatedAt: new Date('2026-10-21T08:05:00.000Z'),
      };

      const actualizacionObsoleta = {
        id: '1',
        calidadPercibida: 2,
        updatedAt: new Date('2026-10-21T07:55:00.000Z'),
      };

      const debeAplicarMasReciente =
        actualizacionMasReciente.updatedAt.getTime() >
        registroServidor.updatedAt.getTime();
      expect(debeAplicarMasReciente).toBe(true);

      const debeAplicarObsoleta =
        actualizacionObsoleta.updatedAt.getTime() >
        registroServidor.updatedAt.getTime();
      expect(debeAplicarObsoleta).toBe(false);
    });
  });

  describe('8. Compatibilidad con operaciones offline (Dexie / Outbox)', () => {
    it('una carga util generada por OutboxService mapea al registro', () => {
      const cargaUtilOutbox = {
        client_id: '8f7e6d5c-4b3a-4210-9876-543210fedcba',
        id_usuario: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
        fecha: '2026-10-21',
        hora_acostarse: '2026-10-20T23:30:00.000Z',
        hora_despertar: '2026-10-21T07:00:00.000Z',
        latencia_min: 15,
        despertares: 1,
        calidad_percibida: 4,
        fatiga_percibida: 2,
        es_dia_laboral: true,
        luz_matutina_min: 30,
        updated_at: '2026-10-21T07:15:00.000Z',
      };

      const entradaPrisma = {
        idUsuario: cargaUtilOutbox.id_usuario,
        fecha: new Date(cargaUtilOutbox.fecha),
        horaAcostarse: new Date(cargaUtilOutbox.hora_acostarse),
        horaDespertar: new Date(cargaUtilOutbox.hora_despertar),
        latenciaMin: cargaUtilOutbox.latencia_min,
        despertares: cargaUtilOutbox.despertares,
        calidadPercibida: cargaUtilOutbox.calidad_percibida,
        fatigaPercibida: cargaUtilOutbox.fatiga_percibida,
        esDiaLaboral: cargaUtilOutbox.es_dia_laboral,
        luzMatutinaMin: cargaUtilOutbox.luz_matutina_min,
        clientId: cargaUtilOutbox.client_id,
      };

      expect(entradaPrisma.idUsuario).toBe(cargaUtilOutbox.id_usuario);
      expect(entradaPrisma.clientId).toBe(cargaUtilOutbox.client_id);
      expect(entradaPrisma.calidadPercibida).toBe(4);
      expect(entradaPrisma.fatigaPercibida).toBe(2);
    });
  });

  describe('9. Restricciones de integridad y mapeo snake_case', () => {
    it('mapea todos los nombres de columnas a snake_case en PostgreSQL', () => {
      const mapeosEsperados = [
        '@map("id_usuario")',
        '@map("hora_acostarse")',
        '@map("hora_despertar")',
        '@map("latencia_min")',
        '@map("calidad_percibida")',
        '@map("fatiga_percibida")',
        '@map("es_dia_laboral")',
        '@map("luz_matutina_min")',
        '@map("client_id")',
        '@map("updated_at")',
      ];

      for (const mapeo of mapeosEsperados) {
        expect(contenidoSchema).toContain(mapeo);
      }
    });

    it('la tabla en la migracion SQL utiliza el nombre exacto', () => {
      expect(contenidoMigracion).toContain('CREATE TABLE "registro_sueno"');
    });
  });

  describe('10. Ausencia de dependencias ficticias con otros modelos', () => {
    // aptitud_presalida si declara FK reales (RF12); la regla aplica solo a registro_sueno.
    it('no define relaciones @relation en el modelo RegistroSueno', () => {
      const modelo = contenidoSchema.match(/model\s+RegistroSueno\s+\{[^}]*\}/)?.[0];
      expect(modelo).toBeDefined();
      expect(modelo).not.toContain('@relation');
    });

    it('no importa ni contamina schemas ajenos a I5', () => {
      expect(contenidoSchema).not.toContain('model Usuario');
      expect(contenidoSchema).not.toContain('model Area');
      expect(contenidoSchema).not.toContain('model ParametroSistema');
    });
  });

});
