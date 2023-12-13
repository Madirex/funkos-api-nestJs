import { IsInt, IsString, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateFunkoDto {
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

  @IsNotEmpty()
  @IsString()
  category: string //TODO: cambiar a clase Category
}
