import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Headers,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { OperacionesService } from './operaciones.service';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { ActualizarTurnoDto } from './dto/actualizar-turno.dto';

@ApiTags('Operaciones y Turnos (RF04)')
@Controller('operaciones')
export class OperacionesController {
  constructor(private readonly operacionesService: OperacionesService) {}

  @Get('rutas')
  @ApiOperation({ summary: 'Listar rutas de viaje activas (Transporte Cueva S.A.C.)' })
  @ApiResponse({ status: 200, description: 'Lista de rutas obtenida exitosamente.' })
  async listarRutas() {
    return this.operacionesService.listarRutas();
  }

  @Get('turnos')
  @ApiOperation({ summary: 'Listar turnos laborales con filtros opcionales (idUsuario, fecha)' })
  @ApiQuery({ name: 'idUsuario', required: false, description: 'Filtrar por UUID de trabajador' })
  @ApiQuery({ name: 'fecha', required: false, description: 'Filtrar por fecha (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Lista de turnos laborales.' })
  async listarTurnos(
    @Query('idUsuario') idUsuario?: string,
    @Query('fecha') fecha?: string,
  ) {
    return this.operacionesService.listarTurnos({ idUsuario, fecha });
  }

  @Get('turnos/me')
  @ApiOperation({ summary: 'Obtener los turnos laborales del usuario autenticado actual con rango de fechas opcional (desde, hasta)' })
  @ApiQuery({ name: 'desde', required: false, description: 'Fecha de inicio del rango (YYYY-MM-DD)' })
  @ApiQuery({ name: 'hasta', required: false, description: 'Fecha de fin del rango (YYYY-MM-DD)' })
  @ApiQuery({ name: 'idUsuario', required: false, description: 'ID de usuario (fallback para pruebas o desarrollo)' })
  @ApiResponse({ status: 200, description: 'Lista de turnos propios obtenida exitosamente.' })
  @ApiResponse({ status: 400, description: 'Usuario no identificado o parámetros inválidos.' })
  async obtenerTurnosMe(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('idUsuario') idUsuarioQuery?: string,
    @Headers('x-usuario-id') headerIdUsuario?: string,
  ) {
    const idUsuario = idUsuarioQuery || headerIdUsuario;
    if (!idUsuario) {
      throw new BadRequestException('Se requiere identificar al usuario (parámetro idUsuario o cabecera x-usuario-id).');
    }
    return this.operacionesService.listarTurnosMe(idUsuario, desde, hasta);
  }

  @Get('turnos/:id')
  @ApiOperation({ summary: 'Obtener un turno laboral por ID' })
  @ApiResponse({ status: 200, description: 'Turno encontrado.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  async obtenerTurnoPorId(@Param('id') id: string) {
    return this.operacionesService.obtenerTurnoPorId(id);
  }

  @Post('turnos')
  @ApiOperation({ summary: 'Registrar un nuevo turno laboral (RF04, RF14)' })
  @ApiResponse({ status: 201, description: 'Turno creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o ruta no existente.' })
  @ApiResponse({ status: 409, description: 'Conflicto por exceso de jornada laboral sin confirmación (RF14)' })
  async crearTurno(@Body() dto: CrearTurnoDto) {
    return this.operacionesService.crearTurno(dto);
  }

  @Patch('turnos/:id')
  @ApiOperation({ summary: 'Actualizar un turno laboral existente (RF04, RF14)' })
  @ApiResponse({ status: 200, description: 'Turno actualizado correctamente.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  @ApiResponse({ status: 409, description: 'Conflicto por exceso de jornada laboral sin confirmación (RF14)' })
  async actualizarTurno(@Param('id') id: string, @Body() dto: ActualizarTurnoDto) {
    return this.operacionesService.actualizarTurno(id, dto);
  }

  @Delete('turnos/:id')
  @ApiOperation({ summary: 'Eliminar un turno laboral' })
  @ApiResponse({ status: 200, description: 'Turno eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  async eliminarTurno(@Param('id') id: string) {
    return this.operacionesService.eliminarTurno(id);
  }

  @Post('turnos/importar')
  @UseInterceptors(FileInterceptor('archivo'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Importar turnos laborales masivamente desde archivo CSV' })
  @ApiResponse({ status: 201, description: 'Importación procesada con conteo de éxito y errores.' })
  @ApiResponse({ status: 400, description: 'Archivo inválido o formato incorrecto.' })
  async importarTurnos(@UploadedFile() archivo: { buffer: Buffer; originalname?: string }) {
    if (!archivo || !archivo.buffer) {
      throw new BadRequestException('Debe adjuntar un archivo CSV válido en el campo "archivo"');
    }
    return this.operacionesService.importarTurnosCsv(archivo.buffer);
  }
}
