import { Injectable } from '@nestjs/common'
import { Funko } from '../entities/funko.entity'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { v4 as uuidv4 } from 'uuid'
import { plainToClass } from 'class-transformer'
import { Category } from '../../categories/entities/category.entity'
import { UpdateFunkoDto } from '../dto/update-funko.dto'
import { ResponseFunkoDto } from '../dto/response-funko.dto'

/**
 * Mapper de Funkos
 */
@Injectable()
export class FunkoMapper {
  /**
   * Mapea un DTO de creación de Funko a una entidad de Funko
   * @param createFunkoDto DTO de creación de Funko
   * @param category Entidad de categoría
   */
  toEntity(createFunkoDto: CreateFunkoDto, category: Category): Funko {
    const funkoEntity = plainToClass(Funko, createFunkoDto)
    funkoEntity.id = uuidv4()
    funkoEntity.createdAt = new Date()
    funkoEntity.updatedAt = new Date()
    funkoEntity.name = createFunkoDto.name.trim()
    funkoEntity.image = createFunkoDto.image
      ? createFunkoDto.image.trim()
      : Funko.IMAGE_DEFAULT
    funkoEntity.category = category
    funkoEntity.isActive = true
    return funkoEntity
  }

  /**
   * Mapea un DTO de actualización de Funko a una entidad de Funko
   * @param dto DTO de actualización de Funko
   * @param entity Entidad de Funko
   * @param category Entidad de categoría
   */
  mapUpdateToEntity(
    dto: UpdateFunkoDto,
    entity: Funko,
    category: Category,
  ): Funko {
    const funko = new Funko()
    funko.id = entity.id
    funko.createdAt = entity.createdAt
    funko.updatedAt = new Date()
    funko.name = dto.name ? dto.name.trim() : entity.name
    funko.price = dto.price || entity.price
    funko.stock = dto.stock || entity.stock
    funko.image = dto.image ? dto.image.trim() : entity.image
    funko.category = category || entity.category
    funko.isActive = entity.isActive
    return funko
  }

  /**
   * Mapea una entidad de Funko a un DTO de respuesta
   * @param entity Entidad de Funko
   */
  mapEntityToResponseDto(entity: Funko): ResponseFunkoDto {
    return plainToClass(ResponseFunkoDto, entity)
  }
}
