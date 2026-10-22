import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';
import { PrismaHealthIndicator } from './prisma.health';
import { Publica } from '../common/decorators/publica.decorator';

const LIMITE_HEAP_BYTES = 512 * 1024 * 1024;

@ApiTags('salud')
@SkipThrottle()
@Controller('health')
export class SaludController {
  constructor(
    private readonly salud: HealthCheckService,
    private readonly bd: PrismaHealthIndicator,
    private readonly memoria: MemoryHealthIndicator,
    private readonly disco: DiskHealthIndicator,
  ) {}

  @Get()
  @Publica()
  @HealthCheck()
  @ApiOperation({ summary: 'Verificar estado de salud del sistema y disponibilidad (RNF07)' })
  @ApiResponse({ status: 200, description: 'Sistema operativo y servicios saludables.' })
  @ApiResponse({ status: 503, description: 'Servicio degradado o no disponible.' })
  comprobar() {
    return this.salud.check([
      () => this.bd.comprobar('bd'),
      () => this.memoria.checkHeap('memoria_heap', LIMITE_HEAP_BYTES),
      () =>
        this.disco.checkStorage('disco', {
          thresholdPercent: 0.9,
          path: process.platform === 'win32' ? 'C:\\' : '/',
        }),
    ]);
  }
}

