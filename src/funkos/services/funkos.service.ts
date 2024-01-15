import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { UpdateFunkoDto } from '../dto/update-funko.dto'
import { FunkoMapper } from '../mappers/funko.mapper'
import { Funko } from '../entities/funko.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from '../../categories/entities/category.entity'
import { Repository } from 'typeorm'
import { isUUID } from 'class-validator'
import { StorageService } from '../../storage/storage.service'
import { Request } from 'express'
import { FunkosNotificationsGateway } from '../../websockets/notifications/funkos-notifications.gateway'
import {
  NotificationType,
  WsNotification,
} from '../../websockets/notifications/notification.model'
import { ResponseFunkoDto } from '../dto/response-funko.dto'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate'
import { hash } from 'typeorm/util/StringUtils'

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
   * @param storageService Servicio de Storage
   * @param funkosNotificationsGateway Gateway de notificaciones de Funkos
   * @param cacheManager Gestor de caché
   */
  constructor(
    @InjectRepository(Funko)
    private readonly funkoRepository: Repository<Funko>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly funkoMapper: FunkoMapper,
    private readonly storageService: StorageService,
    private readonly funkosNotificationsGateway: FunkosNotificationsGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Obtiene todos los Funkos
   * @param query Query de paginación
   * @returns Arreglo con todos los Funkos
   */
  async findAll(query: PaginateQuery) {
    this.logger.log('Obteniendo todos los Funkos')

    // check cache
    const cache = await this.cacheManager.get(
      `all_funkos_page_${hash(JSON.stringify(query))}`,
    )
    if (cache) {
      this.logger.log('Cache hit')
      return cache
    }

    const queryBuilder = this.funkoRepository
      .createQueryBuilder('funko')
      .leftJoinAndSelect('funko.category', 'category')

    let pagination: Paginated<Funko>
    try {
      pagination = await paginate(query, queryBuilder, {
        sortableColumns: ['name', 'category', 'price', 'stock'],
        defaultSortBy: [['name', 'ASC']],
        searchableColumns: ['name', 'category', 'price', 'stock'],
        filterableColumns: {
          name: [FilterOperator.ILIKE, FilterSuffix.NOT, FilterOperator.EQ],
          category: [FilterOperator.ILIKE, FilterSuffix.NOT, FilterOperator.EQ],
          price: true,
          stock: true,
          isActive: [FilterOperator.ILIKE, FilterSuffix.NOT, FilterOperator.EQ],
        },
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }

    const res = {
      data: (pagination.data ?? []).map((funko) =>
        this.funkoMapper.mapEntityToResponseDto(funko),
      ),
      meta: pagination.meta,
      links: pagination.links,
    }

    // Guardamos en caché
    await this.cacheManager.set(
      `all_funkos_page_${hash(JSON.stringify(query))}`,
      res,
      60,
    )
    return res
  }

  /**
   * Obtiene un Funko dado el ID
   * @param id Identificador del Funko
   * @returns Funko encontrado
   */
  async findOne(@Param('id') id: string): Promise<ResponseFunkoDto> {
    this.logger.log(`Obteniendo Funko por id: ${id}`)

    // Caché
    const cache: ResponseFunkoDto = await this.cacheManager.get(`funko_${id}`)
    if (cache) {
      console.log('Cache hit')
      this.logger.log('Cache hit')
      return cache
    }

    const isNumeric = !isNaN(Number(id))
    if (!id || isNumeric || !isUUID(id)) {
      throw new BadRequestException('ID no válido')
    }
    const funko = await this.funkoRepository.findOne({
      where: { id },
      relations: ['category'],
    })

    if (!funko) {
      throw new NotFoundException(`Funko con ID: ${id} no encontrado`)
    }

    const res = this.funkoMapper.mapEntityToResponseDto(funko)

    // Se guarda en caché
    await this.cacheManager.set(`funko_${id}`, res, 60)

    return res
  }

  /**
   * Crea un Funko
   * @param createFunkoDto DTO de creación de Funko
   * @returns Funko creado
   */
  async create(createFunkoDto: CreateFunkoDto): Promise<ResponseFunkoDto> {
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
    if (funko.category == null) {
      delete funko.category
    }

    const dto = this.funkoMapper.mapEntityToResponseDto(funko)
    this.onChange(NotificationType.CREATE, dto)

    const res = await this.funkoRepository.save({
      ...funko,
    })

    // caché
    await this.invalidateCacheKey('all_funkos')

    return this.funkoMapper.mapEntityToResponseDto(res)
  }

  /**
   * Actualiza un Funko
   * @param id Identificador del Funko
   * @param updateFunkoDto DTO de actualización de Funko
   * @returns Funko actualizado
   */
  async update(
    @Param('id') id: string,
    updateFunkoDto: UpdateFunkoDto,
  ): Promise<
    {
      image: string
      createdAt: Date
      price: number
      name: string
      id: string
      stock: number
      category: string
      isActive: boolean
      updatedAt: Date
    } & ResponseFunkoDto
  > {
    this.logger.log(
      `Actualizando Funko con datos: ${JSON.stringify(updateFunkoDto)}`,
    )

    const isNumeric = !isNaN(Number(id))

    if (!id || isNumeric || !isUUID(id)) {
      throw new BadRequestException('ID no válido')
    }

    await this.findOne(id)
    const funkoToUpdate = await this.funkoRepository.findOne({
      where: { id },
      relations: ['category'],
    })

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

    if (funkoToUpdate.category != null) {
      delete funkoToUpdate.category
    }

    if (funko.category != null) {
      delete funko.category
    }

    const dto = this.funkoMapper.mapEntityToResponseDto(funko)

    this.onChange(NotificationType.UPDATE, dto)

    const res = await this.funkoRepository.save({
      ...funkoToUpdate,
      ...funko,
    })

    // invalidar caché
    await this.invalidateCacheKey(`funko_${id}`)
    await this.invalidateCacheKey('all_funkos')

    return this.funkoMapper.mapEntityToResponseDto(res)
  }

  /**
   * Elimina un Funko
   * @param id Identificador del Funko
   * @returns Funko eliminado
   */
  async remove(@Param('id') id: string): Promise<ResponseFunkoDto> {
    this.logger.log(`Eliminando Funko con id: ${id}`)
    const isNumeric = !isNaN(Number(id))
    if (!id || isNumeric || !isUUID(id)) {
      throw new BadRequestException('ID no válido')
    }
    await this.findOne(id)
    const funkoToRemove = await this.funkoRepository.findOne({
      where: { id },
      relations: ['category'],
    })

    const dto = this.funkoMapper.mapEntityToResponseDto(funkoToRemove)

    this.onChange(NotificationType.DELETE, dto)

    const res = await this.funkoRepository.save({
      ...funkoToRemove,
      isActive: false,
    })

    // invalidar caché
    await this.invalidateCacheKey(`funko_${id}`)
    await this.invalidateCacheKey('all_funkos')

    return this.funkoMapper.mapEntityToResponseDto(res)
  }

  /**
   * Retorna un Funko dado el nombre
   * @param name Nombre del Funko
   * @private Función privada
   * @returns Funko encontrado
   */
  async getByName(name: string) {
    const funkoOp = await this.funkoRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', {
        name: name.toLowerCase(),
      })
      .getOne()
    return this.funkoMapper.mapEntityToResponseDto(funkoOp)
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

  /**
   * Actualiza la imagen de un Funko
   * @param id Identificador del Funko
   * @param file Fichero
   * @param req Petición
   * @param withUrl Indica si se debe generar la URL
   */
  public async updateImage(
    id: string,
    file: Express.Multer.File,
    req: Request,
    withUrl: boolean = false,
  ) {
    this.logger.log(`Actualizando imagen Funko por id: ${id}`)
    await this.findOne(id)
    const funkoToUpdate = await this.funkoRepository.findOne({
      where: { id },
      relations: ['category'],
    })

    if (funkoToUpdate.image !== Funko.IMAGE_DEFAULT) {
      this.logger.log(`Borrando imagen ${funkoToUpdate.image}`)
      let imagePath = funkoToUpdate.image
      if (withUrl) {
        imagePath = this.storageService.getFileNameWithoutUrl(
          funkoToUpdate.image,
        )
      }
      try {
        this.storageService.removeFile(imagePath)
      } catch (error) {
        this.logger.error(error)
      }
    }

    if (!file) {
      throw new BadRequestException('Fichero no encontrado.')
    }

    let filePath: string

    if (withUrl) {
      this.logger.log(`Generando url para ${file.filename}`)
      const apiVersion = process.env.API_VERSION
        ? `/${process.env.API_VERSION}`
        : '/v1'
      filePath = `${req.protocol}://${req.get('host')}${apiVersion}/storage/${
        file.filename
      }`
    } else {
      filePath = file.filename
    }

    funkoToUpdate.image = filePath

    const dto = this.funkoMapper.mapEntityToResponseDto(funkoToUpdate)

    this.onChange(NotificationType.UPDATE, dto)

    const res = await this.funkoRepository.save(funkoToUpdate)

    // invalidar caché
    await this.invalidateCacheKey(`funko_${id}`)
    await this.invalidateCacheKey('all_funkos')

    return this.funkoMapper.mapEntityToResponseDto(res)
  }

  /**
   * @description Método que invalida una clave de caché
   * @param keyPattern Patrón de la clave a invalidar
   */
  async invalidateCacheKey(keyPattern: string): Promise<void> {
    const cacheKeys = await this.cacheManager.store.keys()
    const keysToDelete = cacheKeys.filter((key) => key.startsWith(keyPattern))
    const promises = keysToDelete.map((key) => this.cacheManager.del(key))
    await Promise.all(promises)
  }

  /**
   * @description Método que envía una notificación a los clientes conectados
   * @param type Tipo de notificación
   * @param data Datos de la notificación
   * @private Método privado
   */
  private onChange(type: NotificationType, data: ResponseFunkoDto) {
    const notification = new WsNotification<ResponseFunkoDto>(
      'Funkos',
      type,
      data,
      new Date(),
    )
    this.funkosNotificationsGateway.sendMessage(notification)
  }
}
