import { IsInt, IsString, IsNotEmpty, IsNumber, Min } from 'class-validator'

export class CreateFunkoDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @IsString({ message: 'El nombre debe de ser un String' })
  name: string

  @IsNotEmpty({ message: 'El precio no puede estar vacío' })
  @IsNumber({}, { message: 'El precio debe de ser un número' })
  @Min(0, { message: 'La cantidad debe de ser mayor o igual a 0' })
  price: number

  @IsNotEmpty({ message: 'La cantidad no puede estar vacía' })
  @IsInt({ message: 'La cantidad debe de ser un número entero' })
  @Min(0, { message: 'La cantidad debe de ser mayor o igual a 0' })
  quantity: number

  @IsNotEmpty({ message: 'La imagen no puede estar vacía' })
  @IsString({ message: 'La imagen debe de ser un String' })
  image: string

  @IsNotEmpty({ message: 'La categoría no puede estar vacía' })
  @IsString({ message: 'La categoría debe de ser un String' })
  category: string //TODO: cambiar a clase Category
}
