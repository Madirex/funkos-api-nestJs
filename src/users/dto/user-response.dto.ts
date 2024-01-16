/**
 * User response DTO
 */
export class UserDto {
  id: string
  name: string
  surnames: string
  email: string
  username: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  roles: string[]
}
