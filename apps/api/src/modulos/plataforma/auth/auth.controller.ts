import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Auditable } from '../auditoria/auditable.decorator';
import type {
  AuthTokens,
  UsuarioDto,
  UsuarioJwtPayload,
} from '@circadiano/contracts';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistroDto } from './dto/registro.dto';
import { RefrescarTokenDto } from './dto/refrescar-token.dto';
import { RegistroService } from './registro.service';
import { Publica } from './publica.decorator';
import { UsuarioActual } from './usuario-actual.decorator';

@ApiTags('Identidad (RF02)')
@Controller()
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly registro: RegistroService,
  ) {}

  @Publica()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('auth/registro')
  @ApiOperation({ summary: 'Registrar un participante con consentimiento (RN11)' })
  registrar(@Body() dto: RegistroDto): Promise<UsuarioDto> {
    return this.registro.registrar(dto);
  }

  @Publica()
  // 10/min por IP: los trabajadores pueden compartir la red de la empresa al iniciar turno.
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Auditable('login')
  @Post('auth/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Iniciar sesion y obtener tokens' })
  iniciarSesion(@Body() dto: LoginDto): Promise<AuthTokens> {
    return this.auth.iniciarSesion(dto.correo, dto.clave);
  }

  @Publica()
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Post('auth/refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Renovar tokens con el token de refresco' })
  refrescar(@Body() dto: RefrescarTokenDto): Promise<AuthTokens> {
    return this.auth.refrescar(dto.refreshToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Perfil del usuario autenticado' })
  perfil(@UsuarioActual() usuario: UsuarioJwtPayload): Promise<UsuarioDto> {
    return this.auth.obtenerPerfil(usuario.sub);
  }
}
