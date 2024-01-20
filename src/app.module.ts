import { Module } from '@nestjs/common'
import { FunkosModule } from './funkos/funkos.module'
import { CategoriesModule } from './categories/categories.module'
import { StorageModule } from './storage/storage.module'
import { NotificationsModule } from './websockets/notifications/notifications.module'
import { FunkosNotificationsGateway } from './websockets/notifications/funkos-notifications.gateway'
import { CategoriesNotificationsGateway } from './websockets/notifications/categories-notifications.gateway'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { OrdersModule } from './orders/orders.module'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './config/database/database.module'
import { CorsConfigModule } from './config/cors/cors.module'

/**
 * Módulo principal de la aplicación
 */
@Module({
  imports: [
    ConfigModule.forRoot(
      process.env.NODE_ENV === 'dev'
        ? { envFilePath: '.env.dev' || '.env' }
        : { envFilePath: '.env.prod' },
    ),
    CorsConfigModule,
    DatabaseModule,
    CategoriesModule,
    FunkosModule,
    StorageModule,
    NotificationsModule,
    CacheModule.register(),
    OrdersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [FunkosNotificationsGateway, CategoriesNotificationsGateway],
})

/**
 * Módulo principal de la aplicación
 */
export class AppModule {}
