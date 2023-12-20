/**
 * Entity Funko
 */
export class Funko {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  category: string //TODO: cambiar a clase Category
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}
