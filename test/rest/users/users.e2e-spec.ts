import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, Logger } from '@nestjs/common'
import * as request from 'supertest'
import { UsersController } from '../../../src/users/controllers/users.controller'
import { UsersService } from '../../../src/users/services/users.service'
import { CreateUserDto } from '../../../src/users/dto/create-user.dto'
import { UpdateUserDto } from '../../../src/users/dto/update-user.dto'
import { JwtAuthGuard } from '../../../src/auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '../../../src/auth/guards/roles-auth.guard'
import { CacheModule } from '@nestjs/cache-manager'

describe('UsersController (e2e)', () => {
  let app: INestApplication
  const endpoint = '/users'
  const simulatedUserId = '2f3c7319-cd8a-2a7f-84ac-47d5a76319ea'

  const createUserDto: CreateUserDto = {
    name: 'Madi',
    surnames: 'Land',
    username: 'Madirex',
    email: 'contact@madirex.com',
    roles: ['USER'],
    password: 'Test1234',
  }

  const updateUserDto: UpdateUserDto = {
    name: 'Madi2',
    surnames: 'Land',
    username: 'Madirex',
    email: 'contact@madirex.com',
    roles: ['USER'],
    password: 'Test1234',
    isDeleted: false,
  }

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    getOrders: jest.fn(),
    getOrder: jest.fn(),
    createOrder: jest.fn(),
    updateOrder: jest.fn(),
    removeOrder: jest.fn(),
    deleteById: jest.fn(),
  }

  const loggerMock = {
    log: jest.fn(),
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: Logger, useValue: loggerMock },
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

  describe('GET /users', () => {
    it('should return all users for admin', async () => {
      mockUsersService.findAll.mockResolvedValue([])
      await request(app.getHttpServer()).get(endpoint).expect(200)
      expect(mockUsersService.findAll).toHaveBeenCalled()
    })
  })

  describe('GET /users/:id', () => {
    it('should return a user by id for admin', async () => {
      mockUsersService.findOne.mockResolvedValue({})
      await request(app.getHttpServer())
        .get(`${endpoint}/${simulatedUserId}`)
        .expect(200)
      expect(mockUsersService.findOne).toHaveBeenCalled()
    })
  })

  describe('POST /users', () => {
    it('should create a new user for admin', async () => {
      mockUsersService.create.mockResolvedValue({})
      await request(app.getHttpServer())
        .post(endpoint)
        .send(createUserDto)
        .expect(201)
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto)
    })
  })

  describe('PUT /users/:id', () => {
    it('should update a user by id for admin', async () => {
      mockUsersService.update.mockResolvedValue({})
      await request(app.getHttpServer())
        .put(`${endpoint}/${simulatedUserId}`)
        .send(updateUserDto)
        .expect(200)
      expect(mockUsersService.update).toHaveBeenCalledWith(
        simulatedUserId,
        updateUserDto,
        true,
      )
    })
  })

  describe('DELETE /users/:id', () => {
    it('delete a user by id for admin (not found)', async () => {
      mockUsersService.deleteById.mockResolvedValue({})
      await request(app.getHttpServer())
        .delete(`${endpoint}/${simulatedUserId}`)
        .expect(404)
    })
  })
})
