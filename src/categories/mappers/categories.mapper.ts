import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from '../dto/create-category.dto'
import { Category, CategoryType } from '../entities/category.entity'
import { UpdateCategoryDto } from '../dto/update-category.dto'

@Injectable()
export class CategoriesMapper {
  mapCreateToEntity(dto: CreateCategoryDto): Category {
    const category = new Category()
    category.categoryType = dto.categoryType
      ? dto.categoryType
      : CategoryType.OTHER
    category.createdAt = new Date()
    category.updatedAt = new Date()
    category.name = dto.name ? dto.name.trim() : ''
    category.isActive = true
    return category
  }

  mapUpdateToEntity(dto: UpdateCategoryDto, entity: Category): Category {
    const category = new Category()
    category.categoryType = dto.categoryType
      ? dto.categoryType
      : entity.categoryType
    category.createdAt = entity.createdAt || new Date()
    category.updatedAt = new Date()
    category.name = dto.name ? dto.name.trim() : entity.name
    category.isActive = entity.isActive
    return category
  }
}
