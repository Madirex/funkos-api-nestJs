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
import { Funko } from './entities/funko.entity'

@Injectable()
export class FunkosService {
  private funkos = []
  private readonly logger = new Logger(FunkosService.name)

  constructor(private readonly funkoMapper: FunkoMapper) {}

  async findAll() {
    this.logger.log('Obteniendo todos los Funkos')
    return this.funkos
  }

  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Funko> {
    const funko = this.funkos.find((funko) => funko.id === id)
    this.logger.log(`Obteniendo Funko por id: ${id}`)
    if (!funko) {
      throw new NotFoundException(`Funko con ID: ${id} no encontrado`)
    }
    return funko
  }

  async create(createFunkoDto: CreateFunkoDto): Promise<CreateFunkoDto> {
    this.logger.log(
      `Creando Funko con datos: ${JSON.stringify(createFunkoDto)}`,
    )
    const funko = this.funkoMapper.mapCreateToEntity(createFunkoDto)
    this.funkos.push(funko)
    return funko
  }

  async update(
    @Param('id', ParseUUIDPipe) id: string,
    updateFunkoDto: UpdateFunkoDto,
  ): Promise<UpdateFunkoDto> {
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

  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<Funko> {
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
