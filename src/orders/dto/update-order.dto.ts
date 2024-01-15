import { PartialType } from '@nestjs/mapped-types'
import { ClientDto, CreateOrderDto, OrderLineDto } from './create-order.dto'
import { IsNotEmpty, IsNumber } from 'class-validator'

/**
 * @description Data transfer object for updating an order
 */
export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsNumber()
  @IsNotEmpty()
  userId: number

  @IsNotEmpty()
  client: ClientDto

  @IsNotEmpty()
  orderLines: OrderLineDto[]
}
