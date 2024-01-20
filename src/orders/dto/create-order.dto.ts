import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

/**
 * @description Data transfer object for creating an address
 */
export class AddressDto {
  @IsString({ message: 'La calle debe ser un texto' })
  @MaxLength(100, { message: 'La calle debe tener menos de 100 caracteres' })
  @IsNotEmpty({ message: 'La calle no debe estar vacía' })
  street: string

  @IsString({ message: 'El número debe ser un texto' })
  @MaxLength(50, { message: 'El número debe tener menos de 50 caracteres' })
  @IsNotEmpty({ message: 'El número no debe estar vacío' })
  number: string

  @IsString({ message: 'La ciudad debe ser un texto' })
  @MaxLength(100, { message: 'La ciudad debe tener menos de 100 caracteres' })
  @IsNotEmpty({ message: 'La ciudad no debe estar vacía' })
  city: string

  @IsString({ message: 'La provincia debe ser un texto' })
  @MaxLength(100, {
    message: 'La provincia debe tener menos de 100 caracteres',
  })
  @IsNotEmpty({ message: 'La provincia no debe estar vacía' })
  province: string

  @IsString({ message: 'El país debe ser un texto' })
  @MaxLength(100, { message: 'El país debe tener menos de 100 caracteres' })
  @IsNotEmpty({ message: 'El país no debe estar vacío' })
  country: string

  @IsString({ message: 'El código postal debe ser un texto' })
  @MaxLength(100, {
    message: 'El código postal debe tener menos de 100 caracteres',
  })
  @IsNotEmpty({ message: 'El código postal no debe estar vacío' })
  postalCode: string
}

/**
 * @description Data transfer object for creating a client
 */
export class ClientDto {
  @IsString({ message: 'El nombre completo debe ser un texto' })
  @MaxLength(100, {
    message: 'El nombre completo debe tener menos de 100 caracteres',
  })
  @IsNotEmpty({ message: 'El nombre completo no debe estar vacío' })
  fullName: string

  @IsString({ message: 'El email debe ser un texto' })
  @MaxLength(100, { message: 'El email debe tener menos de 100 caracteres' })
  @IsEmail({}, { message: 'El email debe ser un email válido' })
  email: string

  @IsString({ message: 'El teléfono debe ser un texto' })
  @MaxLength(100, { message: 'El teléfono debe tener menos de 100 caracteres' })
  @IsNotEmpty({ message: 'El teléfono no debe estar vacío' })
  phone: string

  @IsNotEmpty({ message: 'La dirección no debe estar vacía' })
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  address: AddressDto
}

/**
 * @description Data transfer object for creating an order line
 */
export class OrderLineDto {
  @IsUUID('4', {
    message: 'El ID del producto (Funko) debe ser un UUID válido',
  })
  @IsNotEmpty({ message: 'El ID del producto no debe estar vacío' })
  productId: string

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un número' },
  )
  @IsNotEmpty({ message: 'El precio no debe estar vacío' })
  @Min(0, { message: 'El precio debe ser mayor que 0' })
  productPrice: number

  @IsNumber({}, { message: 'El stock debe ser un número' })
  @IsNotEmpty({ message: 'El stock no debe estar vacío' })
  @Min(1, { message: 'El stock debe ser mayor que 0' })
  stock: number
}

/**
 * @description Data transfer object for creating an order
 */
export class CreateOrderDto {
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID' })
  @IsNotEmpty({ message: 'El ID del usuario no debe estar vacío' })
  userId: string

  @IsNotEmpty({ message: 'El cliente no debe estar vacío' })
  @ValidateNested({ each: true })
  @Type(() => ClientDto)
  client: ClientDto

  @IsNotEmpty({ message: 'Las líneas de pedido no deben estar vacías' })
  @ValidateNested({ each: true })
  @Type(() => OrderLineDto)
  orderLines: OrderLineDto[]
}
