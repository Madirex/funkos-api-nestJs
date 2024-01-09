import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateCategoryDto } from '../dto/create-category.dto'
import { UpdateCategoryDto } from '../dto/update-category.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from '../entities/category.entity'
import { Repository } from 'typeorm'
import { CategoriesMapper } from '../mappers/categories.mapper'

/**
 * Servicio de categorías
 */
@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name)

  /**
   * Constructor
   * @param categoriesRepository Repositorio de categorías
   * @param categoriesMapper Mapper de categorías
   */
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    private readonly categoriesMapper: CategoriesMapper,
  ) {}

  /**
   * Obtener todas las categorías
   * @returns Arreglo con todas las categorías
   */
  async findAll() {
    this.logger.log('Obteniendo todas las categorías')
    const categories = await this.categoriesRepository.find()
    return categories.map((category) =>
      this.categoriesMapper.mapEntityToResponseDto(category),
    )
  }

  /**
   * Obtener una categoría dado el ID
   * @param id Identificador de la categoría
   * @returns Categoría encontrada
   */
  async findOne(id: number) {
    this.logger.log(`Obteniendo categoría por id: ${id}`)
    const isNumeric = !isNaN(Number(id))
    if (!id || !isNumeric || id < 0 || id > 2147483647) {
      throw new BadRequestException('ID no válido')
    }
    const category = await this.categoriesRepository.findOneBy({ id })
    if (!category) {
      throw new NotFoundException(`Categoría con ID: ${id} no encontrada`)
    }
    return this.categoriesMapper.mapEntityToResponseDto(category)
  }

  /**
   * Crear una categoría
   * @param createCategoryDto DTO de creación de categoría
   * @returns Categoría creada
   */
  async create(createCategoryDto: CreateCategoryDto) {
    this.logger.log(
      `Creando categoría con datos: ${JSON.stringify(createCategoryDto)}`,
    )

    if (createCategoryDto.name) {
      const category = await this.getByName(createCategoryDto.name.trim())

      if (category) {
        this.logger.log(`Categoría con nombre: ${category.name} ya existe`)
        throw new BadRequestException(
          `La categoría con el nombre ${category.name} ya existe`,
        )
      }
    }

    const category = this.categoriesMapper.toEntity(createCategoryDto)

    const categoryResponse = await this.categoriesRepository.save({
      ...category,
    })
    return this.categoriesMapper.mapEntityToResponseDto(categoryResponse)
  }

  /**
   * Actualizar una categoría
   * @param id Identificador de la categoría
   * @param updateCategoryDto DTO de actualización de categoría
   * @returns Categoría actualizada
   */
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    this.logger.log(
      `Actualizando categoría ${id} con datos: ${JSON.stringify(
        updateCategoryDto,
      )}`,
    )

    const isNumeric = !isNaN(Number(id))

    if (!id || !isNumeric || id < 0 || id > 2147483647) {
      throw new BadRequestException('ID no válido')
    }

    const categoryToUpdate = await this.findOne(id)

    if (!categoryToUpdate) {
      throw new NotFoundException(`Categoría con ID: ${id} no encontrada`)
    }

    if (updateCategoryDto.name) {
      const category = await this.getByName(updateCategoryDto.name.trim())

      if (category && category.id !== id) {
        this.logger.log(`Categoría con nombre: ${category.name} ya existe`)
        throw new BadRequestException(
          `La categoría con el nombre ${category.name} ya existe`,
        )
      }
    }

    const categoryEntity = await this.categoriesRepository.findOneBy({ id })

    const category = this.categoriesMapper.mapUpdateToEntity(
      updateCategoryDto,
      categoryEntity,
    )

    const categoryResponse = await this.categoriesRepository.save({
      ...categoryToUpdate,
      ...category,
    })
    return this.categoriesMapper.mapEntityToResponseDto(categoryResponse)
  }

  /**
   * Eliminar una categoría
   * @param id Identificador de la categoría
   * @returns Categoría eliminada
   */
  async remove(id: number) {
    this.logger.log(`Eliminando categoría con id: ${id}`)
    const isNumeric = !isNaN(Number(id))
    if (!id || !isNumeric || id < 0 || id > 2147483647) {
      throw new BadRequestException('ID no válido')
    }
    const categoryToRemove = await this.findOne(id)
    const category = await this.categoriesRepository.save({
      ...categoryToRemove,
      isActive: false,
    })
    return this.categoriesMapper.mapEntityToResponseDto(category)
  }

  /**
   * Retorna una categoría dado el nombre
   * @param name Nombre de la categoría
   * @private Función privada
   * @returns Categoría encontrada
   */
  async getByName(name: string) {
    const category = await this.categoriesRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', {
        name: name.toLowerCase(),
      })
      .getOne()
    return this.categoriesMapper.mapEntityToResponseDto(category)
  }
}
