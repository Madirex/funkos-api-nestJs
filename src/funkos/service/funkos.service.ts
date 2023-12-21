import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { UpdateFunkoDto } from '../dto/update-funko.dto'
import { FunkoMapper } from '../mappers/funko.mapper'
import { Funko } from '../entities/funko.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from '../../categories/entities/category.entity'
import { Repository } from 'typeorm'

/**
 * Servicio de Funkos
 */
@Injectable()
export class FunkosService {
  private readonly logger = new Logger(FunkosService.name)

  /**
   * Constructor
   * @param funkoRepository Repositorio de Funkos
   * @param categoryRepository Repositorio de categorías
   * @param funkoMapper Mapper de Funkos
   */
  constructor(
    @InjectRepository(Funko)
    private readonly funkoRepository: Repository<Funko>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly funkoMapper: FunkoMapper,
  ) {}

  /**
   * Obtiene todos los Funkos
   * @returns Arreglo con todos los Funkos
   */
  async findAll() {
    this.logger.log('Obteniendo todos los Funkos')
    return this.funkoRepository.find({
      relations: ['category'],
    })
  }

  /**
   * Obtiene un Funko dado el ID
   * @param id Identificador del Funko
   * @returns Funko encontrado
   */
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Funko> {
    this.logger.log(`Obteniendo Funko por id: ${id}`)
    if (!id) {
      throw new BadRequestException('ID no válido')
    }
    const funko = await this.funkoRepository.findOne({
      where: { id },
      relations: ['category'],
    })

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
  async create(createFunkoDto: CreateFunkoDto): Promise<Funko> {
    this.logger.log(
      `Creando Funko con datos: ${JSON.stringify(createFunkoDto)}`,
    )
    if (createFunkoDto.name) {
      const funko = await this.getByName(createFunkoDto.name.trim())

      if (funko) {
        this.logger.log(`Funko con nombre: ${funko.name} ya existe`)
        throw new BadRequestException(
          `El Funko con el nombre ${funko.name} ya existe`,
        )
      }
    }

    let category = null
    if (createFunkoDto.category) {
      category = await this.getCategoryByName(createFunkoDto.category)
    }
    const funko = this.funkoMapper.toEntity(createFunkoDto, category)
    return await this.funkoRepository.save({
      ...funko,
    })
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
  ): Promise<
    {
      image: string
      createdAt: Date
      price: number
      name: string
      id: string
      stock: number
      category: Category
      isActive: boolean
      updatedAt: Date
    } & Funko
  > {
    this.logger.log(
      `Actualizando Funko con datos: ${JSON.stringify(updateFunkoDto)}`,
    )

    if (!id) {
      throw new BadRequestException('ID no válido')
    }

    const funkoToUpdate = await this.findOne(id)

    if (!funkoToUpdate) {
      throw new NotFoundException(`Funko con ID: ${id} no encontrado`)
    }

    if (updateFunkoDto.name) {
      const funko = await this.getByName(updateFunkoDto.name.trim())

      if (funko && funko.id !== id) {
        this.logger.log(`Funko con nombre: ${funko.name} ya existe`)
        throw new BadRequestException(
          `El Funko con el nombre ${funko.name} ya existe`,
        )
      }
    }

    let category = null

    if (updateFunkoDto.category) {
      category = await this.getCategoryByName(updateFunkoDto.category)
    }

    const funko = this.funkoMapper.mapUpdateToEntity(
      updateFunkoDto,
      funkoToUpdate,
      category,
    )

    return await this.funkoRepository.save({
      ...funkoToUpdate,
      ...funko,
    })
  }

  /**
   * Elimina un Funko
   * @param id Identificador del Funko
   * @returns Funko eliminado
   */
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<Funko> {
    this.logger.log(`Eliminando Funko con id: ${id}`)
    if (!id) {
      throw new BadRequestException('ID no válido')
    }
    const funkoToRemove = await this.findOne(id)
    return await this.funkoRepository.save({
      ...funkoToRemove,
      isActive: false,
    })
  }

  /**
   * Retorna un Funko dado el nombre
   * @param name Nombre del Funko
   * @private Función privada
   * @returns Funko encontrado
   */
  async getByName(name: string) {
    return await this.funkoRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', {
        name: name.toLowerCase(),
      })
      .getOne()
  }

  /**
   * Retorna una categoría dado el nombre
   * @param name Nombre de la categoría
   * @private Función privada
   * @returns Categoría encontrada
   */
  async getCategoryByName(name: string) {
    return await this.categoryRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', {
        name: name.toLowerCase(),
      })
      .getOne()
  }
}
