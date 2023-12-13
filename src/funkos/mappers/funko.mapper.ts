import { Injectable } from '@nestjs/common'
import { Funko } from '../entities/funko.entity'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { v4 as uuidv4 } from 'uuid'
import { UpdateFunkoDto } from '../dto/update-funko.dto'
@Injectable()
export class FunkoMapper {
  // mapToDTO(funko: Funko): CreateFunkoDto {
  //   const dto = new CreateFunkoDto()
  //   dto.name = funko.name
  //   dto.price = funko.price
  //   dto.quantity = funko.quantity
  //   dto.image = funko.image
  //   dto.category = funko.category //TODO: reemplazar por Category
  //   return dto
  // }

  mapCreateToEntity(dto: CreateFunkoDto): Funko {
    const funko = new Funko()
    funko.id = uuidv4()
    funko.createdAt = new Date()
    funko.updatedAt = new Date()
    funko.name = dto.name
    funko.price = dto.price
    funko.quantity = dto.quantity
    funko.image = dto.image
    funko.category = dto.category //TODO: reemplazar por Category
    return funko
  }

  mapUpdateToEntity(dto: UpdateFunkoDto, entity: Funko): Funko {
    const funko = new Funko()
    funko.id = entity.id
    funko.createdAt = entity.createdAt
    funko.updatedAt = new Date()
    funko.name = dto.name
    funko.price = dto.price
    funko.quantity = dto.quantity
    funko.image = dto.image
    funko.category = dto.category //TODO: reemplazar por Category
    return funko
  }
}
