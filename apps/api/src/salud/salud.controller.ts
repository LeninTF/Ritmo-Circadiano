import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';
import { Publica } from '../modulos/plataforma/auth/publica.decorator';
import { PrismaHealthIndicator } from './prisma.health';

const LIMITE_HEAP_BYTES = 512 * 1024 * 1024;

@ApiTags('salud')
@SkipThrottle()
@Publica()
@Controller('health')
export class SaludController {
  constructor(
    private readonly salud: HealthCheckService,
    private readonly bd: PrismaHealthIndicator,
    private readonly memoria: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  comprobar() {
    return this.salud.check([
      () => this.bd.comprobar('bd'),
      () => this.memoria.checkHeap('memoria_heap', LIMITE_HEAP_BYTES),
    ]);
  }
}
