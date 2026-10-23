import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AreaDto } from '@circadiano/contracts';
import { Publica } from '../auth/publica.decorator';
import { AreasService } from './areas.service';

@ApiTags('Identidad (RF01)')
@Controller('areas')
export class AreasController {
  constructor(private readonly areas: AreasService) {}

  /** Publica: se necesita antes de registrarse. Solo expone id y nombre. */
  @Publica()
  @Get()
  @ApiOperation({ summary: 'Areas de la empresa para el formulario de registro' })
  listar(): Promise<AreaDto[]> {
    return this.areas.listar();
  }
}
