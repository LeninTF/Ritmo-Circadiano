import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { OperacionesService } from './operaciones.service';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { ActualizarTurnoDto } from './dto/actualizar-turno.dto';
import { ConfirmarTurnoDto } from './dto/confirmar-turno.dto';
import type { Rol, UsuarioJwtPayload } from '@circadiano/contracts';
import { Auditable, Roles, UsuarioActual } from '../plataforma/auth';

/** RF04: asignan y consultan turnos de cualquier trabajador. El trabajador usa /turnos/me. */
const GESTIONAN_TURNOS: Rol[] = ['jefe_operaciones', 'despachador', 'administrador'];

// RN01: solo se audita cuando el exceso de jornada se confirma explicitamente.
const esExcesoConfirmado = (solicitud: { body?: { confirmarExceso?: unknown } }) =>
  solicitud.body?.confirmarExceso === true;

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
  @Roles(...GESTIONAN_TURNOS)
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
  @ApiResponse({ status: 200, description: 'Lista de turnos propios obtenida exitosamente.' })
  async obtenerTurnosMe(
    // El usuario sale del token: un idUsuario en query o cabecera dejaria ver turnos ajenos.
    @UsuarioActual() usuario: UsuarioJwtPayload,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.operacionesService.listarTurnosMe(usuario.sub, desde, hasta);
  }

  @Get('turnos/:id')
  @Roles(...GESTIONAN_TURNOS)
  @ApiOperation({ summary: 'Obtener un turno laboral por ID' })
  @ApiResponse({ status: 200, description: 'Turno encontrado.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  async obtenerTurnoPorId(@Param('id') id: string) {
    return this.operacionesService.obtenerTurnoPorId(id);
  }

  @Post('turnos')
  @Roles(...GESTIONAN_TURNOS)
  @Auditable('turno_forzado', esExcesoConfirmado)
  @ApiOperation({ summary: 'Registrar un nuevo turno laboral (RF04, RF14)' })
  @ApiQuery({ name: 'forzar', required: false, description: 'Forzar la creación (RN01 / RF14)' })
  @ApiResponse({ status: 201, description: 'Turno creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o ruta no existente.' })
  @ApiResponse({ status: 409, description: 'Conflicto por exceso de jornada laboral sin confirmación (RF14)' })
  async crearTurno(@Body() dto: CrearTurnoDto, @Query('forzar') forzar?: string) {
    if (forzar === 'true' && dto.confirmarExceso === undefined) {
      dto.confirmarExceso = true;
      if (!dto.motivoExceso) {
        dto.motivoExceso = 'Forzado por query param forzar=true';
      }
    }
    return this.operacionesService.crearTurno(dto);
  }

  @Patch('turnos/:id')
  @Roles(...GESTIONAN_TURNOS)
  @Auditable('turno_forzado', esExcesoConfirmado)
  @ApiOperation({ summary: 'Actualizar un turno laboral existente (RF04, RF14)' })
  @ApiQuery({ name: 'forzar', required: false, description: 'Forzar la actualización (RN01 / RF14)' })
  @ApiResponse({ status: 200, description: 'Turno actualizado correctamente.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  @ApiResponse({ status: 409, description: 'Conflicto por exceso de jornada laboral sin confirmación (RF14)' })
  async actualizarTurno(
    @Param('id') id: string,
    @Body() dto: ActualizarTurnoDto,
    @Query('forzar') forzar?: string,
  ) {
    if (forzar === 'true' && dto.confirmarExceso === undefined) {
      dto.confirmarExceso = true;
      if (!dto.motivoExceso) {
        dto.motivoExceso = 'Forzado por query param forzar=true';
      }
    }
    return this.operacionesService.actualizarTurno(id, dto);
  }

  @Patch('turnos/:id/confirmacion')
  @Roles('trabajador')
  @ApiOperation({ summary: 'Confirmar o corregir el horario real del turno propio (RF05)' })
  @ApiResponse({ status: 200, description: 'Turno confirmado o corregido (repetir la misma solicitud no cambia nada).' })
  @ApiResponse({ status: 400, description: 'Estado inválido o horas reales faltantes/incoherentes.' })
  @ApiResponse({ status: 403, description: 'El turno no pertenece al trabajador o el rol no es trabajador.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  @ApiResponse({ status: 409, description: 'El turno cambió durante la confirmación (solicitud simultánea).' })
  async confirmarTurno(
    @Param('id') id: string,
    @Body() dto: ConfirmarTurnoDto,
    // El dueño sale del token; el servicio rechaza turnos ajenos con 403.
    @UsuarioActual() usuario: UsuarioJwtPayload,
  ) {
    return this.operacionesService.confirmarTurno(id, usuario.sub, dto);
  }

  @Delete('turnos/:id')
  @Roles(...GESTIONAN_TURNOS)
  @ApiOperation({ summary: 'Eliminar un turno laboral' })
  @ApiResponse({ status: 200, description: 'Turno eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  async eliminarTurno(@Param('id') id: string) {
    return this.operacionesService.eliminarTurno(id);
  }

  @Post('turnos/importar')
  @Roles(...GESTIONAN_TURNOS)
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
