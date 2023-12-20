import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator'

/**
 * Clase DTO (Data Transfer Object) para la creación de Funkos
 */
export class CreateFunkoDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @IsString({ message: 'El nombre debe de ser un String' })
  @MaxLength(255, { message: 'El nombre no puede tener más de 255 caracteres' })
  name: string

  @IsNotEmpty({ message: 'El precio no puede estar vacío' })
  @IsNumber({}, { message: 'El precio debe de ser un número' })
  @Min(0, { message: 'El precio debe de ser mayor o igual a 0' })
  @Max(1000000, { message: 'El precio no debe de ser mayor a 1000000' })
  @IsOptional()
  price?: number

  @IsNotEmpty({ message: 'El stock no puede estar vacía' })
  @IsInt({ message: 'El stock debe de ser un número entero' })
  @Min(0, { message: 'El stock debe de ser mayor o igual a 0' })
  @Max(1000000, { message: 'El stock no debe de ser mayor a 1000000' })
  @IsOptional()
  stock?: number

  @IsNotEmpty({ message: 'La imagen no puede estar vacía' })
  @IsString({ message: 'La imagen debe de ser un String' })
  @MaxLength(1020, {
    message: 'La imagen no puede tener más de 1020 caracteres',
  })
  @IsOptional()
  image?: string

  @IsNotEmpty({ message: 'La categoría no puede estar vacía' })
  @IsString({ message: 'La categoría debe de ser un String' })
  @MaxLength(255, {
    message: 'El nombre de la categoría no puede tener más de 255 caracteres',
  })
  @IsOptional()
  category?: string | ''
}
