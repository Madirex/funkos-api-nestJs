import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator'

/**
 * @description Data transfer object for creating an address
 */
export class AddressDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  street: string

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  number: string

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  city: string

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  province: string

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  country: string

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  postalCode: string
}

/**
 * @description Data transfer object for creating a client
 */
export class ClientDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  fullName: string

  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  phone: string

  @IsNotEmpty()
  address: AddressDto
}

/**
 * @description Data transfer object for creating an order line
 */
export class OrderLineDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'El precio debe ser mayor que 0' })
  productPrice: number

  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'El stock debe ser mayor que 0' })
  stock: number

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'La cantidad debe ser mayor que 0' })
  quantity: number
}

/**
 * @description Data transfer object for creating an order
 */
export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number

  @IsNotEmpty()
  client: ClientDto

  @IsNotEmpty()
  orderLines: OrderLineDto[]
}
