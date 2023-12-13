import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class UpdateFunkoDto {
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
