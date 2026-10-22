import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
  AuthTokens,
  UsuarioDto,
  UsuarioJwtPayload,
} from '@circadiano/contracts';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefrescarTokenDto } from './dto/refrescar-token.dto';
import { Publica } from './publica.decorator';
import { UsuarioActual } from './usuario-actual.decorator';

@ApiTags('Identidad (RF02)')
@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Publica()
  @Post('auth/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Iniciar sesion y obtener tokens' })
  iniciarSesion(@Body() dto: LoginDto): Promise<AuthTokens> {
    return this.auth.iniciarSesion(dto.correo, dto.clave);
  }

  @Publica()
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
