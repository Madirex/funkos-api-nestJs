import { Module } from '@nestjs/common'
import { CategoriesService } from './service/categories.service'
import { CategoriesController } from './controller/categories.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from './entities/category.entity'
import { CategoriesMapper } from './mappers/categories.mapper'
import { NotificationsModule } from '../websockets/notifications/notifications.module'

/**
 * Módulo de categorías
 */
@Module({
  imports: [TypeOrmModule.forFeature([Category]), NotificationsModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesMapper],
})
export class CategoriesModule {}
