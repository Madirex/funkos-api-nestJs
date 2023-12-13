import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsDate,
} from 'class-validator'

export class ResponseFunkoDto {
  //TODO: falta implementación
  @IsUUID()
  id: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsNumber()
  price: number

  @IsNotEmpty()
  @IsInt()
  quantity: number

  @IsNotEmpty()
  @IsString()
  image: string

  @IsDate()
  createdAt: Date

  @IsDate()
  updatedAt: Date
}
