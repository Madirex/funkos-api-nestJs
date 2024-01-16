import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator'

/**
 * @description Data transfer object for creating an address
 */
export class AddressDto {
  @IsString({ message: 'La calle debe ser un texto' })
  @MaxLength(100)
  @IsNotEmpty({ message: 'La calle no debe estar vacía' })
  street: string

  @IsString({ message: 'El número debe ser un texto' })
  @MaxLength(50)
  @IsNotEmpty({ message: 'El número no debe estar vacío' })
  number: string

  @IsString({ message: 'La ciudad debe ser un texto' })
  @MaxLength(100)
  @IsNotEmpty({ message: 'La ciudad no debe estar vacía' })
  city: string

  @IsString({ message: 'La provincia debe ser un texto' })
  @MaxLength(100)
  @IsNotEmpty({ message: 'La provincia no debe estar vacía' })
  province: string

  @IsString({ message: 'El país debe ser un texto' })
  @MaxLength(100)
  @IsNotEmpty({ message: 'El país no debe estar vacío' })
  country: string

  @IsString({ message: 'El código postal debe ser un texto' })
  @MaxLength(100)
  @IsNotEmpty({ message: 'El código postal no debe estar vacío' })
  postalCode: string
}

/**
 * @description Data transfer object for creating a client
 */
export class ClientDto {
  @IsString({ message: 'El nombre completo debe ser un texto' })
  @MaxLength(100)
  @IsNotEmpty({ message: 'El nombre completo no debe estar vacío' })
  fullName: string

  @IsString({ message: 'El email debe ser un texto' })
  @MaxLength(100)
  @IsEmail({}, { message: 'El email debe ser un email válido' })
  email: string

  @IsString({ message: 'El teléfono debe ser un texto' })
  @MaxLength(100)
  @IsNotEmpty({ message: 'El teléfono no debe estar vacío' })
  phone: string

  @IsNotEmpty({ message: 'La dirección no debe estar vacía' })
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

  @IsNumber({}, { message: 'El total debe ser un número' })
  @IsNotEmpty({ message: 'El total no debe estar vacío' })
  @Min(0, { message: 'La cantidad debe ser mayor que 0' })
  total: number
}

/**
 * @description Data transfer object for creating an order
 */
export class CreateOrderDto {
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  @IsNotEmpty({ message: 'El ID del usuario no debe estar vacío' })
  userId: number

  @IsNotEmpty({ message: 'El cliente no debe estar vacío' })
  client: ClientDto

  @IsNotEmpty({ message: 'Las líneas de pedido no deben estar vacías' })
  orderLines: OrderLineDto[]
}
