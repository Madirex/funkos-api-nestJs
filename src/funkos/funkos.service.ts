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

/**
 * Servicio de Funkos
 */
@Injectable()
export class FunkosService {
  private funkos = []
  private readonly logger = new Logger(FunkosService.name)

  /**
   * Constructor
   * @param funkoMapper Mapper de Funkos
   */
  constructor(private readonly funkoMapper: FunkoMapper) {}

  /**
   * Obtiene todos los Funkos
   * @returns Arreglo con todos los Funkos
   */
  async findAll() {
    this.logger.log('Obteniendo todos los Funkos')
    return this.funkos
  }

  /**
   * Obtiene un Funko dado el ID
   * @param id Identificador del Funko
   * @returns Funko encontrado
   */
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Funko> {
    this.logger.log(`Obteniendo Funko por id: ${id}`)
    const funko = this.funkos.find((funko) => funko.id === id)
    if (!funko) {
      throw new NotFoundException(`Funko con ID: ${id} no encontrado`)
    }
    return funko
  }

  /**
   * Crea un Funko
   * @param createFunkoDto DTO de creación de Funko
   * @returns Funko creado
   */
  async create(createFunkoDto: CreateFunkoDto): Promise<CreateFunkoDto> {
    this.logger.log(
      `Creando Funko con datos: ${JSON.stringify(createFunkoDto)}`,
    )
    const funko = this.funkoMapper.mapCreateToEntity(createFunkoDto)
    this.funkos.push(funko)
    return funko
  }

  /**
   * Actualiza un Funko
   * @param id Identificador del Funko
   * @param updateFunkoDto DTO de actualización de Funko
   * @returns Funko actualizado
   */
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
    this.funkos[index] = this.funkoMapper.mapUpdateToEntity(
      updateFunkoDto,
      this.funkos[index],
    )
    return this.funkos[index]
  }

  /**
   * Elimina un Funko
   * @param id Identificador del Funko
   * @returns Funko eliminado
   */
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
