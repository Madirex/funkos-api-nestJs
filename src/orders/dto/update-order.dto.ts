import { PartialType } from '@nestjs/mapped-types'
import { ClientDto, CreateOrderDto, OrderLineDto } from './create-order.dto'
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

/**
 * @description Data transfer object for updating an order
 */
export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  @IsNotEmpty({ message: 'El ID del usuario no debe estar vacío' })
  userId: number

  @IsNotEmpty({ message: 'El cliente no debe estar vacío' })
  @ValidateNested({ each: true })
  @Type(() => ClientDto)
  client: ClientDto

  @IsNotEmpty({ message: 'Las líneas de pedido no deben estar vacías' })
  @ValidateNested({ each: true })
  @Type(() => OrderLineDto)
  orderLines: OrderLineDto[]
}
