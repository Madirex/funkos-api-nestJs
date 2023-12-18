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
    funko.name = dto.name.trim()
    funko.price = dto.price
    funko.quantity = dto.quantity
    funko.image = dto.image.trim()
    funko.category = dto.category.trim() //TODO: reemplazar por Category
    return funko
  }

  mapUpdateToEntity(dto: UpdateFunkoDto, entity: Funko): Funko {
    const funko = new Funko()
    funko.id = entity.id
    funko.createdAt = entity.createdAt
    funko.updatedAt = new Date()
    funko.name = dto.name.trim()
    funko.price = dto.price
    funko.quantity = dto.quantity
    funko.image = dto.image.trim()
    funko.category = dto.category.trim() //TODO: reemplazar por Category
    return funko
  }
}
