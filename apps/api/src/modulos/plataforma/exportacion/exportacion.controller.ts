import { Controller, Get, Header } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { Auditable } from '../auditoria/auditable.decorator';
import { Roles } from '../auth/roles.decorator';
import { ExportacionService } from './exportacion.service';

@ApiTags('Administracion (RF16)')
@ApiBearerAuth()
@Roles('administrador')
@Controller('admin/export')
export class ExportacionController {
  constructor(private readonly exportacion: ExportacionService) {}

  @Get('indicadores.csv')
  @Auditable('exportacion')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="indicadores-pretest.csv"')
  @ApiProduces('text/csv')
  @ApiOperation({ summary: 'CSV seudonimizado del pretest (sin correo ni nombres; 409 si hay menos de 5)' })
  exportar(): Promise<string> {
    return this.exportacion.generarCsv();
  }
}
