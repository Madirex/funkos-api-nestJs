import { Module } from '@nestjs/common'
import { FunkosService } from '././services/funkos.service'
import { FunkosController } from '././controllers/funkos.controller'
import { FunkoMapper } from './mappers/funko.mapper'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Funko } from './entities/funko.entity'
import { Category } from '../categories/entities/category.entity'
import { StorageModule } from '../storage/storage.module'
import { NotificationsModule } from '../websockets/notifications/notifications.module'
import { CacheModule } from '@nestjs/cache-manager'

/**
 * Módulo de Funkos
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Funko]),
    TypeOrmModule.forFeature([Category]),
    StorageModule,
    NotificationsModule,
    CacheModule.register(),
  ],
  controllers: [FunkosController],
  providers: [FunkosService, FunkoMapper],
})
export class FunkosModule {}
