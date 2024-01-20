import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from '../services/users.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { CacheModule } from '@nestjs/cache-manager'

describe('UsersController', () => {
  let controller: UsersController
  let usersService: UsersService

  const usersServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteById: jest.fn(),
    getOrders: jest.fn(),
    getOrder: jest.fn(),
    createOrder: jest.fn(),
    updateOrder: jest.fn(),
    removeOrder: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      imports: [CacheModule.register()],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    usersService = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('should return all users for ADMIN role', async () => {
      jest.spyOn(usersService, 'findAll').mockResolvedValue([])

      const result = await controller.findAll()

      expect(result).toEqual([])
      expect(usersService.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const userMock = {
        id: 'userId',
        name: 'Madi',
        surnames: 'Land',
        username: 'madirex',
        email: '',
        roles: ['USER'],
        password: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      }

      jest.spyOn(usersService, 'findOne').mockResolvedValue(userMock)

      const result = await controller.findOne('userId')

      expect(result).toEqual(userMock)
      expect(usersService.findOne).toHaveBeenCalledWith('userId')
    })

    it('should throw an error if user is not found', async () => {
      jest
        .spyOn(usersService, 'findOne')
        .mockRejectedValue(new Error('User not found'))

      await expect(() => controller.findOne('userId')).rejects.toThrow(
        'User not found',
      )
    })
  })

  describe('create', () => {
    it('should create a user and return the created user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Madi',
        surnames: 'Land',
        username: 'madirex',
        email: '',
        roles: ['USER'],
        password: '',
      }

      const createdUserMock = {
        id: 'userId',
        ...createUserDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      }

      jest.spyOn(usersService, 'create').mockResolvedValue(createdUserMock)

      const result = await controller.create(createUserDto)

      expect(result).toEqual(createdUserMock)
      expect(usersService.create).toHaveBeenCalledWith(createUserDto)
    })

    it('should throw an error if user creation fails', async () => {
      jest.spyOn(usersService, 'create').mockRejectedValue(new Error())

      await expect(controller.create({} as CreateUserDto)).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Madi',
        surnames: 'Land',
        username: 'madirex',
        email: '',
        roles: ['USER'],
        password: '',
        isDeleted: false,
      }

      const updatedUserMock = {
        id: 'userId',
        ...updateUserDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      jest.spyOn(usersService, 'update').mockResolvedValue(updatedUserMock)

      const result = await controller.update('userId', updateUserDto)

      expect(result).toEqual(updatedUserMock)
      expect(usersService.update).toHaveBeenCalledWith(
        'userId',
        updateUserDto,
        true,
      )
    })

    it('should throw an error if user is not found', async () => {
      jest.spyOn(usersService, 'update').mockRejectedValue(new Error())

      await expect(
        controller.update('userId', {} as UpdateUserDto),
      ).rejects.toThrow()
    })
  })
})
