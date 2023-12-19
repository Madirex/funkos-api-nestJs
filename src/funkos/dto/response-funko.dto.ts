import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsDate,
  Min,
  Max,
  IsOptional,
} from 'class-validator'

export class ResponseFunkoDto {
  //TODO: falta implementación
  @IsUUID('4', { message: 'El id debe de ser un UUID válido' }) // TODO: testear
  id: string

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

  //TODO: mantener o eliminar?
  // @IsNotEmpty({ message: 'La categoría no puede estar vacía' })
  // @IsString({ message: 'La categoría debe de ser un String' })
  // @IsOptional()
  // category?: string //TODO: cambiar a clase Category

  @IsDate({ message: 'La fecha de creación debe de ser una fecha' })
  createdAt: Date

  @IsDate({ message: 'La fecha de actualización debe de ser una fecha' })
  updatedAt: Date

  @IsNotEmpty({ message: 'El estado no puede estar vacío' })
  isActive: boolean
}
