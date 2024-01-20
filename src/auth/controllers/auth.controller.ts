import { Body, Controller, Logger, Post } from '@nestjs/common'
import { AuthService } from '../services/auth.service'
import { UserSignUpDto } from '../dto/user-sign.up.dto'
import { UserSignInDto } from '../dto/user-sign.in.dto'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiExcludeEndpoint,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

/**
 * @description Controlador de autenticación
 */
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  /**
   * @description Constructor del controlador
   * @param authService Servicio de autenticación
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * @description Registra un usuario
   * @param userSignUpDto DTO de registro de usuario
   */
  @Post('signup')
  @ApiExcludeEndpoint()
  async singUp(@Body() userSignUpDto: UserSignUpDto) {
    this.logger.log(`singUp: ${JSON.stringify(userSignUpDto)}`)
    return await this.authService.singUp(userSignUpDto)
  }

  /**
   * @description Loguea un usuario
   * @param userSignInDto DTO de login de usuario
   */
  @Post('signin')
  @ApiResponse({
    status: 200,
    description:
      'El usuario se ha logueado correctamente devolviendo el token de acceso',
    type: String,
  })
  @ApiBody({
    description: 'Credenciales de acceso',
    type: UserSignInDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno de la API en base de datos',
  })
  @ApiBadRequestResponse({
    description: 'Error en los datos de entrada',
  })
  async singIn(@Body() userSignInDto: UserSignInDto) {
    this.logger.log(`singIn: ${JSON.stringify(userSignInDto)}`)
    return await this.authService.singIn(userSignInDto)
  }
}
