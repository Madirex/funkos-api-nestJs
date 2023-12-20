import { PartialType } from '@nestjs/mapped-types'
import { CreateFunkoDto } from './create-funko.dto'

/**
 * DTO de actualización de Funko
 */
export class UpdateFunkoDto extends PartialType(CreateFunkoDto) {}
