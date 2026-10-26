import { Controller, Get, Query } from '@nestjs/common';
import { ConsultarHistorialDto } from './dto/consultar-historial.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { HistorialService } from './historial.service';
import { 
  HistorialRespuestaDto, 
  type UsuarioJwtPayload 
} from '@circadiano/contracts';
import { Roles, UsuarioActual } from '../plataforma/auth';

@ApiTags('Historial Personal')
@Controller('historial')
@ApiBearerAuth()
@Roles('trabajador')
@ApiResponse({ status: 401, description: 'Token ausente, inválido o vencido.' })
@ApiResponse({ status: 403, description: 'Solo el trabajador puede consultar su propio historial.' })
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener tendencia de sueño, cafeína y adherencia (7, 14 o 30 días)' })
  @ApiQuery({ name: 'dias', required: true, enum: [7, 14, 30], example: 7 })
  @ApiResponse({ status: 200, description: 'Serie cronológica de métricas diarias obtenida.' })
  @ApiResponse({ status: 400, description: 'Parámetro dias inválido.' })
  async getMe(
    @Query() q: ConsultarHistorialDto,
    @UsuarioActual() usuario: UsuarioJwtPayload,
  ): Promise<HistorialRespuestaDto> {
    return this.historialService.getHistorial(usuario.sub, q.dias);
  }
}