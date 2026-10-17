import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma.health';
import { SaludController } from './salud.controller';

@Module({
  imports: [TerminusModule],
  controllers: [SaludController],
  providers: [PrismaHealthIndicator],
})
export class SaludModule {}
