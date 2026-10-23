import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CafeinaService } from './cafeina.service';
import { BebidaDto } from '@circadiano/contracts';

@ApiTags('bebidas')
@Controller('bebidas')
export class BebidasController {
  constructor(private readonly cafeinaService: CafeinaService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener catálogo completo de bebidas con cafeína' })
  @ApiResponse({ status: 200, description: 'Catálogo de bebidas obtenido correctamente.' })
  async obtenerBebidas(): Promise<BebidaDto[]> {
    return this.cafeinaService.obtenerBebidas();
  }
}
