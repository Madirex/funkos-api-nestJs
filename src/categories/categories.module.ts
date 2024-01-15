import { Module } from '@nestjs/common'
import { CategoriesService } from '././services/categories.service'
import { CategoriesController } from '././controllers/categories.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from './entities/category.entity'
import { CategoriesMapper } from './mappers/categories.mapper'
import { NotificationsModule } from '../websockets/notifications/notifications.module'
import { CacheModule } from '@nestjs/cache-manager'

/**
 * Módulo de categorías
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    NotificationsModule,
    CacheModule.register(),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesMapper],
})
export class CategoriesModule {}
