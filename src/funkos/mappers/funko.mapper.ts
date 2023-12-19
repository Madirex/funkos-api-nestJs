import { Injectable } from '@nestjs/common'
import { Funko } from '../entities/funko.entity'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { v4 as uuidv4 } from 'uuid'
import { UpdateFunkoDto } from '../dto/update-funko.dto'
@Injectable()
export class FunkoMapper {
  mapCreateToEntity(dto: CreateFunkoDto): Funko {
    const funko = new Funko()
    funko.id = uuidv4()
    funko.createdAt = new Date()
    funko.updatedAt = new Date()
    funko.name = dto.name ? dto.name.trim() : ''
    funko.price = dto.price || 0
    funko.quantity = dto.quantity || 0
    funko.image = dto.image ? dto.image.trim() : ''
    funko.category = dto.category ? dto.category.trim() : 'defaultCategory' //TODO: reemplazar por Category
    funko.isActive = true
    return funko
  }

  mapUpdateToEntity(dto: UpdateFunkoDto, entity: Funko): Funko {
    const funko = new Funko()
    funko.id = entity.id
    funko.createdAt = entity.createdAt || new Date()
    funko.updatedAt = new Date()
    funko.name = dto.name ? dto.name.trim() : entity.name
    funko.price = dto.price || entity.price
    funko.quantity = dto.quantity || entity.quantity
    funko.image = dto.image ? dto.image.trim() : entity.image
    funko.category = dto.category ? dto.category.trim() : entity.category //TODO: reemplazar por Category
    funko.isActive = entity.isActive
    return funko
  }
}
