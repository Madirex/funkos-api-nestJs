import { Exclude } from 'class-transformer'

/**
 * Clase DTO (Data Transfer Object) para recibir datos del Funko
 */
export class ResponseFunkoDto {
  id: string

  name: string

  price: number

  stock: number

  image: string

  @Exclude({ toPlainOnly: true, toClassOnly: true })
  category: string

  createdAt: Date

  updatedAt: Date

  isActive: boolean
}
