import { Module } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CategoriesController } from './categories.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from './entities/category.entity'
import { CategoriesMapper } from './mappers/categories.mapper'

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesMapper],
  imports: [TypeOrmModule.forFeature([Category])],
})
export class CategoriesModule {}
