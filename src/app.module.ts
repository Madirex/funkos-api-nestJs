import { Module } from '@nestjs/common'
import { FunkosModule } from './funkos/funkos.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriesModule } from './categories/categories.module'
import { StorageModule } from './storage/storage.module'
import { NotificationsModule } from './websockets/notifications/notifications.module'
import { FunkosNotificationsGateway } from './websockets/notifications/funkos-notifications.gateway'
import { CategoriesNotificationsGateway } from './websockets/notifications/categories-notifications.gateway'

/**
 * Módulo principal de la aplicación
 */
@Module({
  imports: [
    CategoriesModule,
    FunkosModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password123',
      database: 'FUNKOS_DB',
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      synchronize: true,
    }),
    StorageModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [FunkosNotificationsGateway, CategoriesNotificationsGateway],
})

/**
 * Módulo principal de la aplicación
 */
export class AppModule {}
