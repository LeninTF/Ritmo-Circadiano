import { Body, Controller, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificacionesService } from './notificaciones.service';
import { CrearSuscripcionPushDto, NotificacionRespuestaDto } from '@circadiano/contracts';

@ApiTags('notificaciones')
@Controller()
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Post('push/suscripciones')
  @ApiOperation({ summary: 'Guardar o actualizar suscripción Web Push VAPID' })
  @ApiResponse({ status: 201, description: 'Suscripción guardada correctamente.' })
  async guardarSuscripcion(@Body() dto: CrearSuscripcionPushDto): Promise<void> {
    return this.notificacionesService.guardarSuscripcion(dto);
  }

  @Patch('notificaciones/:id/abierta')
  @ApiOperation({ summary: 'Marcar notificación como abierta (Indicador D2)' })
  @ApiResponse({ status: 200, description: 'Notificación marcada como abierta.' })
  async marcarAbierta(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NotificacionRespuestaDto> {
    return this.notificacionesService.marcarAbierta(id);
  }
}
