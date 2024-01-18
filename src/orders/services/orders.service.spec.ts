import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { getRepositoryToken } from '@nestjs/typeorm'
import { PaginateModel } from 'mongoose'
import { Repository } from 'typeorm'
import { OrdersService } from './orders.service'
import { Order, OrderDocument } from '../schemas/order.schema'
import { Funko } from '../../funkos/entities/funko.entity'
import { OrdersMapper } from '../mappers/orders.mapper'
import { User } from '../../users/entities/user.entity'
import { NotFoundException } from '@nestjs/common'

describe('OrdersService', () => {
  let ordersService: OrdersService
  let ordersModel: PaginateModel<OrderDocument>
  let ordersRepository: PaginateModel<OrderDocument>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order.name),
          useValue: {
            paginate: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Order),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Funko),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        OrdersMapper,
      ],
    }).compile()

    ordersService = module.get<OrdersService>(OrdersService)
    ordersModel = module.get<PaginateModel<OrderDocument>>(
      getModelToken(Order.name),
    )
    ordersRepository = module.get<PaginateModel<OrderDocument>>(
      getModelToken(Order.name),
    )
  })

  describe('findAll', () => {
    it('should return paginated results', async () => {
      const page = 1
      const limit = 10
      const orderBy = 'userId'
      const order = 'asc'

      const mockPaginatedResult = {
        docs: [{ _id: '1', userId: 'user1' }],
        totalDocs: 1,
        limit: limit,
        page: page,
        totalPages: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      }

      jest
        .spyOn(ordersModel, 'paginate')
        .mockResolvedValueOnce(mockPaginatedResult as any)

      const result = await ordersService.findAll(page, limit, orderBy, order)

      expect(result).toEqual(mockPaginatedResult)
      expect(ordersModel.paginate).toHaveBeenCalledTimes(1)
      expect(ordersModel.paginate).toHaveBeenCalledWith(
        {},
        {
          page,
          limit,
          sort: { [orderBy]: order },
          collection: 'es_ES',
        },
      )
    })
  })

  describe('findOne', () => {
    it('should return the order with the given ID', async () => {
      const orderId = 'some-id'
      const mockOrder = { _id: orderId /* other fields */ }

      jest.spyOn(ordersRepository, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockOrder),
      } as any)

      const result = await ordersService.findOne(orderId)

      expect(result).toEqual(mockOrder)
      expect(ordersRepository.findById).toHaveBeenCalledWith(orderId)
    })

    it('should throw NotFoundException if the order is not found', async () => {
      const orderId = 'non-existent-id'

      jest.spyOn(ordersRepository, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any)

      await expect(ordersService.findOne(orderId)).rejects.toThrow(
        new NotFoundException(`Pedido con id ${orderId} no encontrado`),
      )

      expect(ordersRepository.findById).toHaveBeenCalledWith(orderId)
    })
  })

  describe('findByUserId', () => {
    it('should return orders for the given user ID', async () => {
      const userId = 'some-user-id'
      const mockOrders = [{}]

      const findSpy = jest.spyOn(ordersModel, 'find') as any
      findSpy.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValueOnce(mockOrders as any),
      }))

      const result = await ordersService.findByUserId(userId)

      expect(result).toEqual(mockOrders)
      expect(findSpy).toHaveBeenCalledWith({ userId: userId })
    })
  })
})
