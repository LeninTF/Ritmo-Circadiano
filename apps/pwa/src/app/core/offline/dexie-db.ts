import Dexie from 'dexie';

export const DEFAULT_DB_NAME = 'ritmo-db';

export class DexieDb {
  private readonly db: Dexie;

  constructor(name: string = DEFAULT_DB_NAME) {
    this.db = new Dexie(name);

    this.db.version(1).stores({
      planes: '++id,usuario,[usuario+fecha]',
      eventosSolares: '++id,usuario,[usuario+fecha]',
      turnos: '++id,usuario,[usuario+fecha]',
      ingestas: '++id,usuario,[usuario+fecha]',
      diario: '++id,usuario,[usuario+fecha]',
      outbox: '++id,usuario,&[usuario+clientId],[usuario+createdAt]',
    });
  }

  getDatabase(): Dexie {
    return this.db;
  }
}
