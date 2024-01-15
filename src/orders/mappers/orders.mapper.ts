import { Injectable } from '@nestjs/common'
import { CreateOrderDto } from '../dto/create-order.dto'
import { Order } from '../schemas/order.schema'
import { plainToClass } from 'class-transformer'

/**
 * @description Maps a CreateOrderDto to an Order entity
 */
@Injectable()
export class OrdersMapper {
  /**
   * @description Maps a CreateOrderDto to an Order entity
   * @param createOrderDto The CreateOrderDto to map
   */
  toEntity(createOrderDto: CreateOrderDto): Order {
    return plainToClass(Order, createOrderDto)
  }
}
