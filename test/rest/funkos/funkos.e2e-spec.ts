import { Test, TestingModule } from '@nestjs/testing'
import {
  BadRequestException,
  INestApplication,
  NotFoundException,
} from '@nestjs/common'
import * as request from 'supertest'
import { FunkosController } from '../../../src/funkos/./controllers/funkos.controller'
import { FunkosService } from '../../../src/funkos/./services/funkos.service'
import { CreateFunkoDto } from '../../../src/funkos/dto/create-funko.dto'
import { UpdateFunkoDto } from '../../../src/funkos/dto/update-funko.dto'
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { JwtAuthGuard } from '../../../src/auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '../../../src/auth/guards/roles-auth.guard'

describe('FunkosController (e2e)', () => {
  let app: INestApplication
  let cacheManager: Cache
  const endpoint = '/funkos'

  const testFunkoId = '1'
  const testFunko = {
    id: testFunkoId,
    name: 'Funko1',
    description: 'Awesome Funko',
  }
  const testFunkos = [
    {
      id: testFunkoId,
      name: 'Funko1',
      description: 'Awesome Funko',
    },
  ]

  const createFunkoDto: CreateFunkoDto = {
    name: 'Funko1',
  }

  const updateFunkoDto: UpdateFunkoDto = {}

  const mockFunkosService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    exists: jest.fn(),
    updateImage: jest.fn(),
  }

  const cacheManagerMock = {
    get: jest.fn(() => Promise.resolve()),
    set: jest.fn(() => Promise.resolve()),
    store: {
      keys: jest.fn(() => []),
    },
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [FunkosController],
      providers: [
        FunkosService,
        { provide: FunkosService, useValue: mockFunkosService },
        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesAuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    cacheManager = moduleFixture.get<Cache>(CACHE_MANAGER)
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /funkos', () => {
    it('debería retornar todos los Funkos', async () => {
      mockFunkosService.findAll.mockResolvedValue(testFunkos)

      const options = { page: 1, limit: 1 }
      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .query(options)
        .expect(200)

      jest.spyOn(cacheManager, 'get').mockResolvedValue(Promise.resolve(null))
      jest.spyOn(cacheManager, 'set').mockResolvedValue()

      expect(body).toEqual(testFunkos)
      expect(body).toHaveLength(options.limit)
      expect(mockFunkosService.findAll).toHaveBeenCalled()
    })

    it('debería retornar el resultado caché', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(testFunkos)
      const result = await mockFunkosService.findAll()
      expect(result).toEqual(testFunkos)
    })

    it('debería retornar una página de Funkos con una query', async () => {
      mockFunkosService.findAll.mockResolvedValue([testFunko])

      const { body } = await request(app.getHttpServer())
        .get(`${endpoint}?page=1&limit=10`)
        .expect(200)
      expect(() => {
        expect(body).toEqual([testFunko])
        expect(mockFunkosService.findAll).toHaveBeenCalled()
      })
    })
  })

  describe('GET /funkos/:id', () => {
    it('debería retornar el Funko por su ID', async () => {
      mockFunkosService.findOne.mockResolvedValue(testFunko)

      jest.spyOn(cacheManager, 'get').mockResolvedValue(Promise.resolve(null))
      jest.spyOn(cacheManager, 'set').mockResolvedValue()

      const { body } = await request(app.getHttpServer())
        .get(`${endpoint}/${testFunkoId}`)
        .expect(200)

      expect(body).toEqual(testFunko)
      expect(mockFunkosService.findOne).toHaveBeenCalledWith(testFunkoId)
    })

    it('debería retornar un error 404 si el Funko no se encuentra', async () => {
      mockFunkosService.findOne.mockRejectedValue(new NotFoundException())

      await request(app.getHttpServer())
        .get(`${endpoint}/${testFunkoId}`)
        .expect(404)
    })
  })

  describe('POST /funkos', () => {
    it('debería crear un nuevo Funko', async () => {
      mockFunkosService.create.mockResolvedValue(testFunko)

      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue([])

      const { body } = await request(app.getHttpServer())
        .post(endpoint)
        .send(createFunkoDto)
        .expect(201)

      expect(body).toEqual(testFunko)
      expect(mockFunkosService.create).toHaveBeenCalledWith(createFunkoDto)
    })
  })

  describe('PUT /funkos/:id', () => {
    it('debería actualizar un Funko', async () => {
      mockFunkosService.update.mockResolvedValue(testFunko)

      const { body } = await request(app.getHttpServer())
        .put(`${endpoint}/${testFunkoId}`)
        .send(updateFunkoDto)
        .expect(200)

      expect(body).toEqual(testFunko)
      expect(mockFunkosService.update).toHaveBeenCalledWith(
        testFunkoId,
        updateFunkoDto,
      )
    })

    it('debería retornar un error 404 si el Funko no existe', async () => {
      mockFunkosService.update.mockRejectedValue(new NotFoundException())
      await request(app.getHttpServer())
        .put(`${endpoint}/${testFunkoId}`)
        .send(updateFunkoDto)
        .expect(404)
    })

    it('debería retornar un error 400 debido a datos incorrectos', async () => {
      mockFunkosService.update.mockRejectedValue(new BadRequestException())
      await request(app.getHttpServer())
        .put(`${endpoint}/${testFunkoId}`)
        .send(updateFunkoDto)
        .expect(400)
    })
  })

  describe('DELETE /funkos/:id', () => {
    it('debería eliminar el Funko', async () => {
      mockFunkosService.remove.mockResolvedValue(testFunko)

      await request(app.getHttpServer())
        .delete(`${endpoint}/${testFunkoId}`)
        .expect(204)
    })

    it('debería retornar un error 400 por Bad Request', async () => {
      mockFunkosService.remove.mockRejectedValue(new BadRequestException())
      await request(app.getHttpServer())
        .put(`${endpoint}/${testFunkoId}`)
        .send(updateFunkoDto)
        .expect(400)
    })
  })

  describe('PATCH /funkos/image/:id', () => {
    it('debería dar error porque la imagen es un jpg falso', async () => {
      const file = Buffer.from('file')

      mockFunkosService.exists.mockResolvedValue(true)
      mockFunkosService.updateImage.mockResolvedValue(testFunko)

      await request(app.getHttpServer())
        .patch(`${endpoint}/image/${testFunko.id}`)
        .attach('file', file, 'image.jpg')
        .set('Content-Type', 'multipart/form-data')
        .expect(400)
    })
  })
})
