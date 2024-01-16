import { Test, TestingModule } from '@nestjs/testing'
import { OrdersMapper } from './orders.mapper'
import { CreateOrderDto } from '../dto/create-order.dto'
import { Order } from '../schemas/order.schema'

describe('OrdersMapper', () => {
  let ordersMapper: OrdersMapper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersMapper],
    }).compile()

    ordersMapper = module.get<OrdersMapper>(OrdersMapper)
  })

  it('debería estar definido', () => {
    expect(ordersMapper).toBeDefined()
  })

  it('debería mapear CreateOrderDto a entidad Order', () => {
    const createOrderDto: CreateOrderDto = {
      userId: 1,
      client: {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '123456789',
        address: {
          street: '123 Main St',
          number: 'Apt 4',
          city: 'Cityville',
          province: 'Provinceland',
          country: 'Countryland',
          postalCode: '12345',
        },
      },
      orderLines: [
        {
          productId: 'abc123',
          productPrice: 50.0,
          stock: 10,
        },
      ],
    }

    const mappedOrder: Order = ordersMapper.toEntity(createOrderDto)

    expect(mappedOrder.userId).toEqual(createOrderDto.userId)
    expect(mappedOrder.client.fullName).toEqual(createOrderDto.client.fullName)
    expect(mappedOrder.client.email).toEqual(createOrderDto.client.email)
    expect(mappedOrder.client.phone).toEqual(createOrderDto.client.phone)
    expect(mappedOrder.client.address.street).toEqual(
      createOrderDto.client.address.street,
    )
    expect(mappedOrder.client.address.number).toEqual(
      createOrderDto.client.address.number,
    )
    expect(mappedOrder.client.address.city).toEqual(
      createOrderDto.client.address.city,
    )
    expect(mappedOrder.client.address.province).toEqual(
      createOrderDto.client.address.province,
    )
    expect(mappedOrder.client.address.country).toEqual(
      createOrderDto.client.address.country,
    )
    expect(mappedOrder.client.address.postalCode).toEqual(
      createOrderDto.client.address.postalCode,
    )

    expect(mappedOrder.orderLines[0].productId).toEqual(
      createOrderDto.orderLines[0].productId,
    )
    expect(mappedOrder.orderLines[0].productPrice).toEqual(
      createOrderDto.orderLines[0].productPrice,
    )
    expect(mappedOrder.orderLines[0].stock).toEqual(
      createOrderDto.orderLines[0].stock,
    )
  })
})
