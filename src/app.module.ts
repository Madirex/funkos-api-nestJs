import { Logger, Module } from '@nestjs/common'
import { FunkosModule } from './funkos/funkos.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriesModule } from './categories/categories.module'
import { StorageModule } from './storage/storage.module'
import { NotificationsModule } from './websockets/notifications/notifications.module'
import { FunkosNotificationsGateway } from './websockets/notifications/funkos-notifications.gateway'
import { CategoriesNotificationsGateway } from './websockets/notifications/categories-notifications.gateway'
import { CacheModule } from '@nestjs/cache-manager'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { OrdersModule } from './orders/orders.module'
import { AuthModule } from './auth/auth.module'

/**
 * Módulo principal de la aplicación
 */
@Module({
  imports: [
    CategoriesModule,
    FunkosModule,
    // TypeORM
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
    // MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        uri: `mongodb://${process.env.DATABASE_USER}:${
          process.env.DATABASE_PASSWORD
        }@${process.env.MONGO_HOST}:${process.env.MONGO_PORT || 27017}/${
          process.env.MONGO_DATABASE
        }`,
        retryAttempts: 5,
        connectionFactory: (connection) => {
          Logger.log(
            `MongoDB readyState: ${connection.readyState}`,
            'DatabaseModule',
          )
          return connection
        },
      }),
    }),
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
