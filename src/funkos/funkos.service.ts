import {
  Injectable,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { UpdateFunkoDto } from './dto/update-funko.dto'
import { FunkoMapper } from './mappers/funko.mapper'

@Injectable()
export class FunkosService {
  private funkos = []
  private readonly logger = new Logger(FunkosService.name)

  constructor(private readonly funkoMapper: FunkoMapper) {}

  findAll() {
    this.logger.log('Obteniendo todos los Funkos')
    return this.funkos
  }

  findOne(@Param('id', ParseUUIDPipe) id: string) {
    const funko = this.funkos.find((funko) => funko.id === id)
    this.logger.log(`Obteniendo Funko por id: ${id}`)
    if (!funko) {
      throw new NotFoundException(`Funko con ID: ${id} no encontrado`)
    }
    return funko
  }

  create(createFunkoDto: CreateFunkoDto) {
    this.logger.log(
      `Creando Funko con datos: ${JSON.stringify(createFunkoDto)}`,
    )
    const funko = this.funkoMapper.mapCreateToEntity(createFunkoDto)
    this.funkos.push(funko)
    return funko
  }

  update(
    @Param('id', ParseUUIDPipe) id: string,
    updateFunkoDto: UpdateFunkoDto,
  ) {
    this.logger.log(
      `Actualizando Funko con datos: ${JSON.stringify(updateFunkoDto)}`,
    )
    const index = this.funkos.findIndex((funko) => funko.id === id)
    if (index === -1) {
      throw new NotFoundException(`Funko con ID: ${id} no encontrado`)
    }
    const funko = this.funkoMapper.mapUpdateToEntity(
      updateFunkoDto,
      this.funkos[index],
    )
    this.funkos[index] = funko
    return this.funkos[index]
  }

  remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Eliminando Funko con id: ${id}`)
    const index = this.funkos.findIndex((funko) => funko.id === id)
    if (index === -1) {
      throw new NotFoundException(`Funko con ID: ${id} no encontrado`)
    }
    const removed = this.funkos[index]
    this.funkos.splice(index, 1)
    return removed
  }
}
