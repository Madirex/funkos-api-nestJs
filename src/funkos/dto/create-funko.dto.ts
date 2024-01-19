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
import { ApiProperty } from '@nestjs/swagger'

/**
 * Clase DTO (Data Transfer Object) para la creación de Funkos
 */
export class CreateFunkoDto {
  @ApiProperty({
    example: 'Batman',
    description: 'El nombre del Funko',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @IsString({ message: 'El nombre debe de ser un String' })
  @MaxLength(255, { message: 'El nombre no puede tener más de 255 caracteres' })
  name: string

  @ApiProperty({
    example: 99.99,
    description: 'El precio del Funko',
    minimum: 0,
    maximum: 1000000,
  })
  @IsNotEmpty({ message: 'El precio no puede estar vacío' })
  @IsNumber({}, { message: 'El precio debe de ser un número' })
  @Min(0, { message: 'El precio debe de ser mayor o igual a 0' })
  @Max(1000000, { message: 'El precio no debe de ser mayor a 1000000' })
  @IsOptional()
  price?: number

  @ApiProperty({
    example: 10,
    description: 'El stock del Funko',
    minimum: 0,
    maximum: 1000000,
  })
  @IsNotEmpty({ message: 'El stock no puede estar vacía' })
  @IsInt({ message: 'El stock debe de ser un número entero' })
  @Min(0, { message: 'El stock debe de ser mayor o igual a 0' })
  @Max(1000000, { message: 'El stock no debe de ser mayor a 1000000' })
  @IsOptional()
  stock?: number

  @ApiProperty({
    example: 'https://example.com/picture.jpg',
    description: 'La URL de la imagen del Funko',
    required: false,
    maxLength: 1020,
  })
  @IsNotEmpty({ message: 'La imagen no puede estar vacía' })
  @IsString({ message: 'La imagen debe de ser un String' })
  @MaxLength(1020, {
    message: 'La imagen no puede tener más de 1020 caracteres',
  })
  @IsOptional()
  image?: string

  @ApiProperty({
    example: 'Superhéroes',
    description: 'El nombre de la categoría (para relacionar)',
  })
  @IsNotEmpty({ message: 'La categoría no puede estar vacía' })
  @IsString({ message: 'La categoría debe de ser un String' })
  @MaxLength(255, {
    message: 'El nombre de la categoría no puede tener más de 255 caracteres',
  })
  @IsOptional()
  category?: string | ''
}
