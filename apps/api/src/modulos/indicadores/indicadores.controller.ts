import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IndicadoresService } from './indicadores.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Indicadores (RF13)')
@Controller('indicadores')
export class IndicadoresController {
  constructor(private readonly indicadoresService: IndicadoresService) {}

  @Get('panel')
  @Roles('jefe_operaciones')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Obtener panel agregado de indicadores con validación k-anonymity (k >= 5) (RF13)' })
  @ApiQuery({ name: 'desde', required: false, description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'hasta', required: false, description: 'Fecha de fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Panel obtenido exitosamente (puede retornar suficiente: false si n < 5).' })
  async obtenerPanel(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.indicadoresService.obtenerPanel(desde, hasta);
  }
}
