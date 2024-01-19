import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'

/**
 * Configuración de Swagger
 * @param app Aplicación NestJS
 */
export function setupSwagger(app: INestApplication) {
  /**
   * Configuración de Swagger
   */
  const config = new DocumentBuilder()
    .setTitle('API REST Funkos Nestjs')
    .setDescription(
      'API Rest para la gestión de Funkos con NestJS, TypeORM, MongoDB, Mongoose, JWT, Passport, Websockets, etc.',
    )
    .setContact('Madirex', 'https://www.madirex.com', 'contact@madirex.com')
    .setExternalDoc(
      'Documentación de la API',
      'https://github.com/Madirex/funkos-api-nestJs',
    )
    .setLicense('CC BY-NC-SA 4.0', 'https://www.madirex.com/p/license.html')
    .setVersion('1.0.0')
    .addTag('Funkos', 'Operaciones con Funkos')
    .addTag('Storage', 'Operaciones con almacenamiento')
    .addTag('Auth', 'Operaciones de autenticación')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
}
