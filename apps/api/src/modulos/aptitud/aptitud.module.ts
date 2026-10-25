import { Module } from '@nestjs/common';
import { OperacionesModule } from '../operaciones/operaciones.module';
import { AptitudController } from './aptitud.controller';
import { AptitudService } from './aptitud.service';

@Module({
  imports: [OperacionesModule],
  controllers: [AptitudController],
  providers: [AptitudService],
})
export class AptitudModule {}
