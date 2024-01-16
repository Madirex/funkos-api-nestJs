import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { config } from 'dotenv'
import { getSSLOptions } from './config/ssl.config'

/*
 * Función principal de la aplicación
 */
async function bootstrap() {
  const httpsOptions = getSSLOptions()
  const app = await NestFactory.create(AppModule, { httpsOptions })
  app.setGlobalPrefix(process.env.API_VERSION || 'v1')
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.API_PORT || 3000)
}

config()
bootstrap().then(() =>
  console.log(`🟢 Servidor abierto en puerto: ${process.env.API_PORT || 3000}`),
)
