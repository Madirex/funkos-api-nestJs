import { PartialType } from '@nestjs/mapped-types'
import { ClientDto, CreateOrderDto, OrderLineDto } from './create-order.dto'
import { IsNotEmpty, IsNumber } from 'class-validator'

/**
 * @description Data transfer object for updating an order
 */
export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  @IsNotEmpty({ message: 'El ID del usuario no debe estar vacío' })
  userId: number

  @IsNotEmpty({ message: 'El cliente no debe estar vacío' })
  client: ClientDto

  @IsNotEmpty({ message: 'Las líneas de pedido no deben estar vacías' })
  orderLines: OrderLineDto[]
}
