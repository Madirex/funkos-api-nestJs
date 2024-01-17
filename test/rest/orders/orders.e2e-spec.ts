import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { CreateOrderDto } from '../../../src/orders/dto/create-order.dto'
import { UpdateOrderDto } from '../../../src/orders/dto/update-order.dto'
import { OrdersController } from '../../../src/orders/controllers/orders.controller'
import { OrdersService } from '../../../src/orders/services/orders.service'
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager'
import { v4 as uuidv4 } from 'uuid'
import { JwtAuthGuard } from '../../../src/auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '../../../src/auth/guards/roles-auth.guard'

describe('OrdersController (e2e)', () => {
  let app: INestApplication

  const id = uuidv4()

  const testOrder: CreateOrderDto = {
    userId: id,
    client: {
      fullName: 'Nombre Completo',
      email: 'correo@example.com',
      phone: '1234567890',
      address: {
        street: 'Calle Principal',
        number: '123',
        city: 'Ciudad Principal',
        province: 'Provincia Principal',
        country: 'País Principal',
        postalCode: '12345',
      },
    },
    orderLines: [
      {
        productId: 'c7d8e550-51c3-11ec-83c2-4cb16e18b29d',
        productPrice: 29.99,
        stock: 3,
      },
    ],
  }

  const updateOrder: UpdateOrderDto = {
    userId: id,
    client: {
      fullName: 'Nombre Actualizado',
      email: 'nuevo_correo@example.com',
      phone: '9876543210',
      address: {
        street: 'Nueva Calle',
        number: '456',
        city: 'Nueva Ciudad',
        province: 'Nueva Provincia',
        country: 'Nuevo País',
        postalCode: '54321',
      },
    },
    orderLines: [
      {
        productId: 'c7d8e550-51c3-11ec-83c2-4cb16e18b29d',
        productPrice: 34.99,
        stock: 5,
      },
    ],
  }

  const mockOrdersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    exists: jest.fn(),
    updateImage: jest.fn(),
    findByUserId: jest.fn(),
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
      controllers: [OrdersController],
      providers: [
        OrdersService,
        { provide: OrdersService, useValue: mockOrdersService },
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
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /orders', () => {
    it('should return all orders', async () => {
      const { body } = await request(app.getHttpServer()).get('/orders')
      expect(body).toBeDefined()
    })
  })

  describe('GET /orders/:id', () => {
    it('should return a specific order by ID', async () => {
      const { body } = await request(app.getHttpServer()).get('/orders/1')
      expect(body).toBeDefined()
    })
  })

  describe('GET /orders/user/:userId', () => {
    it('should return orders for a specific user', async () => {
      const { body } = await request(app.getHttpServer()).get('/orders/user/1')
      expect(body).toBeDefined()
    })
  })

  describe('POST /orders', () => {
    it('should create a new order', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/orders')
        .send(testOrder)
      expect(body).toBeDefined()
    })
  })

  describe('PUT /orders/:id', () => {
    it('should update a specific order by ID', async () => {
      const { body } = await request(app.getHttpServer())
        .put('/orders/1')
        .send(updateOrder)
      expect(body).toBeDefined()
    })
  })

  describe('DELETE /orders/:id', () => {
    it('should delete a specific order by ID', async () => {
      const orderIdToDelete = '65a6b373127430803ad4be38'
      const { status } = await request(app.getHttpServer()).delete(
        `/orders/${orderIdToDelete}`,
      )
      expect(status).toBe(204)
      expect(mockOrdersService.remove).toHaveBeenCalledWith(orderIdToDelete)
    })
  })
})
