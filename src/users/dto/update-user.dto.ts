import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'
import { IsOptional } from 'class-validator'

/**
 * @description DTO para actualizar un usuario
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  name: string

  @IsOptional()
  surnames: string

  @IsOptional()
  username: string

  @IsOptional()
  email: string

  @IsOptional()
  roles: string[]

  @IsOptional()
  password: string

  @IsOptional()
  isDeleted: boolean
}
