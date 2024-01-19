import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

/**
 * Clase DTO (Data Transfer Object) para recibir datos del Funko
 */
export class ResponseFunkoDto {
  @ApiProperty({
    example: 'b92c1bf8-2cbe-4adc-bd6a-e4006ec2006d',
    description: 'ID del Funko',
  })
  id: string

  @ApiProperty({ example: 'Batman', description: 'Nombre del Funko' })
  name: string

  @ApiProperty({ example: 99.99, description: 'Precio del Funko' })
  price: number

  @ApiProperty({ example: 10, description: 'Stock del Funko' })
  stock: number

  @ApiProperty({
    example: 'https://example.com/picture.jpg',
    description: 'URL de la imagen del Funko',
  })
  image: string

  @ApiProperty({
    example: 'Superhéroes',
    description: 'Nombre de la categoría del Funko',
  })
  @Exclude({ toPlainOnly: true, toClassOnly: true })
  category: string

  @ApiProperty({
    example: '2024-01-01T17:00:21Z',
    description: 'Fecha y hora de creación del Funko',
  })
  createdAt: Date

  @ApiProperty({
    example: '2024-01-01T17:00:21Z',
    description: 'Fecha y hora de actualización del Funko',
  })
  updatedAt: Date

  @ApiProperty({
    example: true,
    description: 'Indica si el Funko está activo o no',
  })
  isActive: boolean
}
