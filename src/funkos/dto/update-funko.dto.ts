import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'

export class UpdateFunkoDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @IsString({ message: 'El nombre debe de ser un String' })
  name: string

  @IsNotEmpty({ message: 'El precio no puede estar vacío' })
  @IsNumber({}, { message: 'El precio debe de ser un número' })
  @Min(0, { message: 'La cantidad debe de ser mayor o igual a 0' })
  @Max(1000000, { message: 'El precio no debe de ser mayor a 1000000' })
  @IsOptional()
  price?: number

  @IsNotEmpty({ message: 'La cantidad no puede estar vacía' })
  @IsInt({ message: 'La cantidad debe de ser un número entero' })
  @Min(0, { message: 'La cantidad debe de ser mayor o igual a 0' })
  @Max(1000000, { message: 'La cantidad no debe de ser mayor a 1000000' })
  @IsOptional()
  quantity?: number

  @IsNotEmpty({ message: 'La imagen no puede estar vacía' })
  @IsString({ message: 'La imagen debe de ser un String' })
  @IsOptional()
  image?: string

  @IsNotEmpty({ message: 'La categoría no puede estar vacía' })
  @IsString({ message: 'La categoría debe de ser un String' })
  @IsOptional()
  category?: string //TODO: cambiar a clase Category
}
