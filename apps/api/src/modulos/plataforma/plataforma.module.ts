import { Module } from '@nestjs/common';
import { AreasController } from './areas/areas.controller';
import { AreasService } from './areas/areas.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AreasController],
  providers: [AreasService],
  exports: [AuthModule],
})
export class PlataformaModule {}
