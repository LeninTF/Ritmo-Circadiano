import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaHealthIndicator {
  constructor(
    private readonly prisma: PrismaService,
    private readonly indicadores: HealthIndicatorService,
  ) {}

  async comprobar(clave: string) {
    const indicador = this.indicadores.check(clave);
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return indicador.up();
    } catch {
      return indicador.down({ mensaje: 'Sin conexion a la base de datos' });
    }
  }
}
