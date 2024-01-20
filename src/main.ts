import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { config } from 'dotenv'
import { getSSLOptions } from './config/ssl/ssl.config'
import { setupSwagger } from './config/swagger/swagger.config'

/*
 * Función principal de la aplicación
 */
async function bootstrap() {
  if (process.env.NODE_ENV === 'dev') {
    console.log('🛠️ Iniciando Nestjs Modo desarrollo 🛠️')
  } else {
    console.log('🚗 Iniciando Nestjs Modo producción 🚗')
  }

  const httpsOptions = getSSLOptions()
  const app = await NestFactory.create(AppModule, { httpsOptions })
  app.setGlobalPrefix(process.env.API_VERSION || 'v1')

  if (process.env.NODE_ENV === 'dev') {
    setupSwagger(app)
  }

  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.API_PORT || 3000)
}

config()
bootstrap().then(() =>
  console.log(
    `🟢 Servidor abierto en puerto: ${process.env.API_PORT || 3000} y perfil: ${process.env.NODE_ENV} 🚀\``,
  ),
)
