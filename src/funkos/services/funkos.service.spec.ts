import { Test, TestingModule } from '@nestjs/testing'
import { FunkosService } from './funkos.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Funko } from '../entities/funko.entity'
import {
  Category,
  CategoryType,
} from '../../categories/entities/category.entity'
import { Repository } from 'typeorm'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { v4 as uuidv4 } from 'uuid'
import { FunkoMapper } from '../mappers/funko.mapper'
import { UpdateFunkoDto } from '../dto/update-funko.dto'
import { StorageService } from '../../storage/storage.service'
import { FunkosNotificationsGateway } from '../../websockets/notifications/funkos-notifications.gateway'
import { ResponseFunkoDto } from '../dto/response-funko.dto'
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

describe('FunkosService', () => {
  let service: FunkosService
  let funkoRepository: Repository<Funko>
  let categoryRepository: Repository<Category>
  let storageService: StorageService
  let funkosNotificationsGateway: FunkosNotificationsGateway
  let cacheManager: Cache

  const funkoMapperMock = {
    toEntity: jest.fn(),
    mapUpdateToEntity: jest.fn(),
    mapEntityToResponseDto: jest.fn(),
  }

  const storageServiceMock = {
    removeFile: jest.fn(),
    getFileNameWithoutUrl: jest.fn(),
  }

  const funkosNotificationsGatewayMock = {
    sendMessage: jest.fn(),
  }

  const cacheManagerMock = {
    get: jest.fn(() => Promise.resolve()),
    set: jest.fn(() => Promise.resolve()),
    store: {
      keys: jest.fn(() => []),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        FunkosService,
        {
          provide: getRepositoryToken(Funko),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
        {
          provide: FunkoMapper,
          useValue: funkoMapperMock,
        },
        {
          provide: FunkosNotificationsGateway,
          useValue: funkosNotificationsGatewayMock,
        },
        { provide: StorageService, useValue: storageServiceMock },
        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
      ],
    }).compile()

    service = module.get<FunkosService>(FunkosService)
    funkoRepository = module.get<Repository<Funko>>(getRepositoryToken(Funko))
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    )
    storageService = module.get<StorageService>(StorageService)
    funkosNotificationsGateway = module.get<FunkosNotificationsGateway>(
      FunkosNotificationsGateway,
    )
    cacheManager = module.get<Cache>(CACHE_MANAGER)
  })

  it('debería estar definido', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('debería devolver un array de Funkos', async () => {
      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'funkos',
      }

      jest.spyOn(cacheManager, 'get').mockResolvedValue(Promise.resolve(null))
      jest.spyOn(cacheManager, 'set').mockResolvedValue()

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([]),
      }

      jest
        .spyOn(funkoRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)

      jest
        .spyOn(funkoMapperMock, 'mapEntityToResponseDto')
        .mockReturnValue(new ResponseFunkoDto())

      // Act
      const res: any = await service.findAll(paginateOptions)

      // Assert
      expect(res.meta.itemsPerPage).toEqual(paginateOptions.limit)
      expect(res.meta.currentPage).toEqual(paginateOptions.page)
      expect(res.links.current).toEqual(
        `funkos?page=${paginateOptions.page}&limit=${paginateOptions.limit}&sortBy=name:ASC`,
      )
    })

    /*it('debería retornar el resultado caché', async () => {
      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'funkos',
      }

      const testFunkos = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          current: 'funkos?page=1&limit=10&sortBy=name:ASC',
        },
      } as Paginated<Funko>

      jest.spyOn(cacheManager, 'get').mockResolvedValue(testFunkos)

      const result = await service.findAll(paginateOptions)

      expect(cacheManager.get).toHaveBeenCalledWith(
        `all_funkos_page_${hash(JSON.stringify(paginateOptions))}`,
      )
      expect(result).toEqual(testFunkos)
    })*/
  })

  describe('findOne', () => {
    it('debería devolver un Funko por ID', async () => {
      const id = uuidv4()
      const mockFunko: Funko = {
        id: id,
        name: 'Funko Ejemplo',
        price: 19.99,
        stock: 10,
        image: 'empty.png',
        category: {
          id: 1,
          name: 'test',
          categoryType: CategoryType.OTHER,
          createdAt: new Date('2023-01-01T12:00:00Z'),
          updatedAt: new Date('2023-01-01T12:00:00Z'),
          isActive: true,
          funkos: [],
        },
        createdAt: new Date('2023-01-01T12:00:00Z'),
        updatedAt: new Date('2023-01-02T14:30:00Z'),
        isActive: true,
      }

      const responseFunkoDto: ResponseFunkoDto = {
        id: id,
        name: 'Funko Ejemplo',
        price: 19.99,
        stock: 10,
        image: 'empty.png',
        category: 'test',
        createdAt: new Date('2023-01-01T12:00:00Z'),
        updatedAt: new Date('2023-01-02T14:30:00Z'),
        isActive: true,
      }

      jest.spyOn(cacheManager, 'get').mockResolvedValue(Promise.resolve(null))
      jest.spyOn(service, 'findOne').mockResolvedValue(responseFunkoDto)
      jest.spyOn(funkoRepository, 'findOne').mockResolvedValue(mockFunko)
      jest.spyOn(cacheManager, 'set').mockResolvedValue()
      const res = await service.findOne(id)
      expect(res).toEqual(responseFunkoDto)
    })

    it('debería lanzar NotFoundException si no se encuentra el Funko con el ID', async () => {
      jest.spyOn(funkoRepository, 'findOne').mockResolvedValue(null)
      await expect(service.findOne(uuidv4())).rejects.toThrow(NotFoundException)
    })

    it('debería lanzar BadRequestException si el ID no es válido', async () => {
      await expect(service.findOne(null)).rejects.toThrow(BadRequestException)
    })
  })

  describe('create', () => {
    it('debería crear un nuevo Funko', async () => {
      const id = uuidv4()
      const createFunkoDto: CreateFunkoDto = {
        name: 'Funko Ejemplo',
        price: 19.99,
        stock: 10,
        image: 'empty.png',
        category: 'test',
      }
      const mockFunko: Funko = {
        id: id,
        name: 'Funko Ejemplo',
        price: 19.99,
        stock: 10,
        image: 'empty.png',
        category: {
          id: 1,
          name: 'test',
          categoryType: CategoryType.OTHER,
          createdAt: new Date('2023-01-01T12:00:00Z'),
          updatedAt: new Date('2023-01-01T12:00:00Z'),
          isActive: true,
          funkos: [],
        },
        createdAt: new Date('2023-01-01T12:00:00Z'),
        updatedAt: new Date('2023-01-02T14:30:00Z'),
        isActive: true,
      }

      const responseMockFunko: ResponseFunkoDto = {
        id: id,
        name: 'Funko Ejemplo',
        price: 19.99,
        stock: 10,
        image: 'empty.png',
        category: 'test',
        createdAt: new Date('2023-01-01T12:00:00Z'),
        updatedAt: new Date('2023-01-02T14:30:00Z'),
        isActive: true,
      }
      jest.spyOn(service, 'getByName').mockResolvedValue(null)
      jest.spyOn(service, 'getCategoryByName').mockResolvedValue(null)
      jest.spyOn(funkoMapperMock, 'toEntity').mockReturnValue(mockFunko)
      jest
        .spyOn(funkoMapperMock, 'mapEntityToResponseDto')
        .mockReturnValue(responseMockFunko)
      jest.spyOn(funkoRepository, 'save').mockResolvedValue(mockFunko)
      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue([])

      const res = await service.create(createFunkoDto)
      expect(res).toEqual(responseMockFunko)
      expect(service.getByName).toHaveBeenCalled()
      expect(service.getCategoryByName).toHaveBeenCalled()
      expect(funkoMapperMock.toEntity).toHaveBeenCalledWith(
        createFunkoDto,
        null,
      )
      expect(funkoRepository.save).toHaveBeenCalledWith({ ...mockFunko })
    })

    it('debería lanzar BadRequestException si el Funko con el mismo nombre ya existe', async () => {
      const createFunkoDto: CreateFunkoDto = {
        name: 'Funko Ejemplo',
        price: 19.99,
        stock: 10,
        image: 'empty.png',
        category: 'test',
      }
      const existingFunko: ResponseFunkoDto = {
        id: uuidv4(),
        name: 'Funko Ejemplo',
        price: 15.99,
        stock: 5,
        image: 'https://www.example.com/favicon.ico',
        category: 'test',
        createdAt: new Date('2023-01-01T12:00:00Z'),
        updatedAt: new Date('2023-01-02T14:30:00Z'),
        isActive: true,
      }

      jest.spyOn(service, 'getByName').mockResolvedValue(existingFunko)

      await expect(service.create(createFunkoDto)).rejects.toThrow(
        BadRequestException,
      )
      expect(service.getByName).toHaveBeenCalledWith(createFunkoDto.name.trim())
    })
  })

  describe('update', () => {
    it('debería actualizar un Funko existente correctamente', async () => {
      const id = uuidv4()
      const updateFunkoDto: UpdateFunkoDto = {
        name: 'Nuevo Nombre',
        price: 25.99,
        stock: 15,
        image: 'https://www.nuevo-ejemplo.com/favicon.ico',
        category: 'nueva category',
      }
      const existingFunko: Funko = {
        id: id,
        name: 'Funko Old',
        price: 19.99,
        stock: 10,
        image: 'https://www.antiguo-ejemplo.com/favicon.ico',
        category: {
          id: 3,
          name: 'old-test',
          categoryType: CategoryType.OTHER,
          createdAt: new Date('2023-01-01T12:00:00Z'),
          updatedAt: new Date('2023-01-01T12:00:00Z'),
          isActive: true,
          funkos: [],
        },
        createdAt: new Date('2023-01-01T12:00:00Z'),
        updatedAt: new Date('2023-01-02T14:30:00Z'),
        isActive: true,
      }

      const mockResponseFunkoResponse: ResponseFunkoDto = {
        id: id,
        name: 'Funko Old',
        price: 19.99,
        stock: 10,
        image: 'https://www.antiguo-ejemplo.com/favicon.ico',
        category: 'old-test',
        createdAt: new Date('2023-01-01T12:00:00Z'),
        updatedAt: new Date('2023-01-02T14:30:00Z'),
        isActive: true,
      }

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockResponseFunkoResponse)
      jest.spyOn(funkoRepository, 'findOne').mockResolvedValue(existingFunko)
      jest.spyOn(service, 'getByName').mockResolvedValue(null)
      jest.spyOn(service, 'getCategoryByName').mockResolvedValue(null)
      jest
        .spyOn(funkoMapperMock, 'mapUpdateToEntity')
        .mockReturnValue(existingFunko)
      jest.spyOn(funkoRepository, 'save').mockResolvedValue(existingFunko)

      jest
        .spyOn(funkoMapperMock, 'mapEntityToResponseDto')
        .mockReturnValue(mockResponseFunkoResponse)

      const res = await service.update(id, updateFunkoDto)

      expect(res).toEqual(mockResponseFunkoResponse)
      expect(service.findOne).toHaveBeenCalledWith(id)
      expect(service.getByName).toHaveBeenCalledWith(updateFunkoDto.name.trim())
      expect(service.getCategoryByName).toHaveBeenCalledWith(
        updateFunkoDto.category,
      )
      expect(funkoMapperMock.mapUpdateToEntity).toHaveBeenCalledWith(
        updateFunkoDto,
        existingFunko,
        null,
      )
      expect(funkoRepository.save).toHaveBeenCalledWith({
        ...existingFunko,
        ...existingFunko,
      })
    })

    it('debería lanzar BadRequestException si el ID no es válido', async () => {
      // Arrange
      const notValidId = null
      const updateFunkoDto: UpdateFunkoDto = {
        name: 'Nuevo Nombre',
      }

      // Act & Assert
      await expect(service.update(notValidId, updateFunkoDto)).rejects.toThrow(
        BadRequestException,
      )
    })

    it('debería lanzar NotFoundException si el Funko a actualizar no se encuentra', async () => {
      // Arrange
      jest.spyOn(service, 'findOne').mockResolvedValue(null)
      jest.spyOn(funkoRepository, 'findOne').mockResolvedValue(null)
      const uuid = uuidv4()

      // Act & Assert
      await expect(service.update(uuid, {} as UpdateFunkoDto)).rejects.toThrow(
        NotFoundException,
      )
      expect(service.findOne).toHaveBeenCalledWith(uuid)
    })

    it('debería lanzar BadRequestException si el nombre del Funko a actualizar ya existe para otro Funko', async () => {
      // Arrange
      const id = uuidv4()
      const updateFunkoDto: UpdateFunkoDto = {
        name: 'Nuevo Nombre',
      }

      const funko: Funko = {
        id: uuidv4(),
        name: 'Nuevo Nombre',
        price: 25.99,
        stock: 15,
        image: 'https://www.nuevo-ejemplo.com/favicon.ico',
        category: {
          id: 4,
          name: 'old-test',
          categoryType: CategoryType.OTHER,
          createdAt: new Date('2023-01-01T12:00:00Z'),
          updatedAt: new Date('2023-01-01T12:00:00Z'),
          isActive: true,
          funkos: [],
        },
        createdAt: new Date('2023-01-01T12:00:00Z'),
        updatedAt: new Date('2023-01-02T14:30:00Z'),
        isActive: true,
      }

      const existingFunko: ResponseFunkoDto = {
        id: uuidv4(),
        name: 'Nuevo Nombre',
        price: 25.99,
        stock: 15,
        image: 'https://www.nuevo-ejemplo.com/favicon.ico',
        category: 'old-test',
        createdAt: new Date('2023-01-01T12:00:00Z'),
        updatedAt: new Date('2023-01-02T14:30:00Z'),
        isActive: true,
      }

      jest.spyOn(service, 'findOne').mockResolvedValue(existingFunko)
      jest.spyOn(funkoRepository, 'findOne').mockResolvedValue(funko)
      jest.spyOn(service, 'getByName').mockResolvedValue(existingFunko)

      // Act & Assert
      await expect(service.update(id, updateFunkoDto)).rejects.toThrow(
        BadRequestException,
      )
      expect(service.findOne).toHaveBeenCalledWith(id)
      expect(service.getByName).toHaveBeenCalledWith(updateFunkoDto.name.trim())
    })
  })

  describe('remove', () => {
    it('debería eliminar un Funko existente correctamente', async () => {
      const id = uuidv4()
      const existingFunko: Funko = {
        id: id,
        name: 'Funko a Eliminar',
        price: 19.99,
        stock: 10,
        image: 'https://www.eliminar-ejemplo.com/favicon.ico',
        category: {
          id: 4,
          name: 'eliminar-test',
          categoryType: CategoryType.OTHER,
          createdAt: new Date('2023-01-01T12:00:00Z'),
          updatedAt: new Date('2023-01-01T12:00:00Z'),
          isActive: true,
          funkos: [],
        },
        createdAt: new Date('2023-01-01T12:00:00Z'),
        updatedAt: new Date('2023-01-02T14:30:00Z'),
        isActive: true,
      }

      const mockResponseFunkoResponse: ResponseFunkoDto = {
        id: id,
        name: 'Funko a Eliminar',
        price: 19.99,
        stock: 10,
        image: 'https://www.eliminar-ejemplo.com/favicon.ico',
        category: 'eliminar-test',
        createdAt: new Date('2023-01-01T12:00:00Z'),
        updatedAt: new Date('2023-01-02T14:30:00Z'),
        isActive: true,
      }

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockResponseFunkoResponse)

      jest.spyOn(funkoRepository, 'findOne').mockResolvedValue(existingFunko)

      jest.spyOn(funkoRepository, 'save').mockResolvedValue(existingFunko)

      jest
        .spyOn(funkoMapperMock, 'mapEntityToResponseDto')
        .mockReturnValue(mockResponseFunkoResponse)

      const res = await service.remove(id)

      expect(res).toEqual(mockResponseFunkoResponse)
      expect(service.findOne).toHaveBeenCalledWith(id)
      expect(funkoRepository.save).toHaveBeenCalledWith({
        ...existingFunko,
        isActive: false,
      })
    })

    it('debería lanzar BadRequestException si el ID no es válido', async () => {
      const idInvalid = null
      await expect(service.remove(idInvalid)).rejects.toThrow(
        BadRequestException,
      )
    })
  })

  describe('getByName', () => {
    it('debería devolver un Funko dado el nombre', async () => {
      const nombre = 'Funko Buscado'
      const id = uuidv4()
      const mockFunko: Funko = {
        id: id,
        name: nombre,
        price: 22.99,
        stock: 12,
        image: 'https://www.buscado-ejemplo.com/favicon.ico',
        category: {
          id: 5,
          name: 'buscado-test',
          categoryType: CategoryType.OTHER,
          createdAt: new Date('2023-01-01T12:00:00Z'),
          updatedAt: new Date('2023-01-01T12:00:00Z'),
          isActive: true,
          funkos: [],
        },
        createdAt: new Date('2023-01-01T12:00:00Z'),
        updatedAt: new Date('2023-01-02T14:30:00Z'),
        isActive: true,
      }
      const mockResponseFunkoResponse: ResponseFunkoDto = {
        id: id,
        name: nombre,
        price: 22.99,
        stock: 12,
        image: 'https://www.buscado-ejemplo.com/favicon.ico',
        category: 'buscado-test',
        createdAt: new Date('2023-01-01T12:00:00Z'),
        updatedAt: new Date('2023-01-02T14:30:00Z'),
        isActive: true,
      }

      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockFunko),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
      }

      jest
        .spyOn(funkoRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder as any)

      jest
        .spyOn(funkoMapperMock, 'mapEntityToResponseDto')
        .mockReturnValue(mockResponseFunkoResponse)

      const res = await service.getByName(nombre)

      expect(res).toEqual(mockResponseFunkoResponse)
      expect(funkoRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('getCategoryByName', () => {
    it('debería devolver una categoría dado el nombre', async () => {
      const categoryName = 'Categoría Buscada'
      const categoryMock: Category = {
        id: 6,
        name: categoryName,
        categoryType: CategoryType.OTHER,
        createdAt: new Date('2023-01-01T12:00:00Z'),
        updatedAt: new Date('2023-01-01T12:00:00Z'),
        isActive: true,
        funkos: [],
      }

      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(categoryMock),
      }

      jest
        .spyOn(categoryRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder as any)

      const res = await service.getCategoryByName(categoryName)

      expect(res).toEqual(categoryMock)
      expect(categoryRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('updateImage', () => {
    it('debería actualizar la imagen de un Funko', async () => {
      const mockRequest = {
        protocol: 'http',
        get: () => 'localhost',
      }
      const mockFile = {
        filename: 'new_image.png',
      }

      const mockNewFunko = new Funko()

      const mockResponseFunkoResponse = new ResponseFunkoDto()

      mockNewFunko.image = 'http://localhost/storage/new_image.png'
      mockResponseFunkoResponse.image = 'http://localhost/storage/new_image.png'

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockResponseFunkoResponse)

      jest.spyOn(funkoRepository, 'findOne').mockResolvedValue(mockNewFunko)

      jest.spyOn(funkoRepository, 'save').mockResolvedValue(mockNewFunko)
      jest
        .spyOn(funkoMapperMock, 'mapEntityToResponseDto')
        .mockReturnValue(mockResponseFunkoResponse)

      expect(
        await service.updateImage(
          uuidv4(),
          mockFile as any,
          mockRequest as any,
          false,
        ),
      ).toEqual(mockResponseFunkoResponse)

      expect(storageService.removeFile).toHaveBeenCalled()
    })
  })
})
