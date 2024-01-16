import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Order, OrderDocument } from '../schemas/order.schema'
import { InjectRepository } from '@nestjs/typeorm'
import { Funko } from '../../funkos/entities/funko.entity'
import { PaginateModel } from 'mongoose'
import { Repository } from 'typeorm'
import { OrdersMapper } from '../mappers/orders.mapper'
import { CreateOrderDto } from '../dto/create-order.dto'
import { UpdateOrderDto } from '../dto/update-order.dto'
import { User } from '../../users/entities/user.entity'

export const OrdersOrderByValues: string[] = ['_id', 'userId']
export const OrdersOrderValues: string[] = ['asc', 'desc']

/**
 * @description The Orders Service
 */
@Injectable()
export class OrdersService {
  private logger = new Logger(OrdersService.name)

  /**
   * Inicializa el servicio de pedidos
   * @param ordersRepository El repositorio de pedidos
   * @param funkosRepository El repositorio de funkos
   * @param usersRepository El repositorio de usuarios
   * @param ordersMapper El mapeador de pedidos
   */
  constructor(
    @InjectModel(Order.name)
    private ordersRepository: PaginateModel<OrderDocument>,
    @InjectRepository(Funko)
    private readonly funkosRepository: Repository<Funko>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly ordersMapper: OrdersMapper,
  ) {}

  /**
   * Busca todos los pedidos
   * @param page El número de página
   * @param limit El límite de resultados por página
   * @param orderBy El campo por el que ordenar
   * @param order El orden de ordenación
   */
  async findAll(page: number, limit: number, orderBy: string, order: string) {
    this.logger.log(
      `Buscando todos los pedidos con paginación y filtros: ${JSON.stringify({
        page,
        limit,
        orderBy,
        order,
      })}`,
    )
    const options = {
      page,
      limit,
      sort: {
        [orderBy]: order,
      },
      collection: 'es_ES',
    }

    return await this.ordersRepository.paginate({}, options)
  }

  /**
   * Busca un pedido por su ID
   * @param id El ID del pedido
   */
  async findOne(id: string) {
    this.logger.log(`Buscando pedido con id ${id}`)
    const orderToFind = await this.ordersRepository.findById(id).exec()
    if (!orderToFind) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`)
    }
    return orderToFind
  }

  /**
   * Busca todos los pedidos de un usuario
   * @param userId El ID del usuario
   */
  async findByUserId(userId: string) {
    this.logger.log(`Buscando pedidos por usuario ${userId}`)
    return await this.ordersRepository.find({ userId: userId }).exec()
  }

  /**
   * Crea un nuevo pedido
   * @param createOrderDto Los datos del pedido a crear
   */
  async create(createOrderDto: CreateOrderDto) {
    this.logger.log(`Creando pedido ${JSON.stringify(createOrderDto)}`)

    const orderToBeSaved = this.ordersMapper.toEntity(createOrderDto)

    await this.checkOrder(orderToBeSaved)

    const orderToSave = await this.reserveStockOrders(orderToBeSaved)

    orderToSave.createdAt = new Date()
    orderToSave.updatedAt = new Date()

    return await this.ordersRepository.create(orderToSave)
  }

  /**
   * Actualiza un pedido
   * @param id El ID del pedido
   * @param updateOrderDto Los datos del pedido a actualizar
   */
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    this.logger.log(
      `Actualizando pedido con id ${id} y ${JSON.stringify(updateOrderDto)}`,
    )

    const orderToUpdate = await this.ordersRepository.findById(id).exec()
    if (!orderToUpdate) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`)
    }

    const orderToBeSaved = this.ordersMapper.toEntity(updateOrderDto)

    await this.returnStockOrders(orderToBeSaved)

    await this.checkOrder(orderToBeSaved)
    const orderToSave = await this.reserveStockOrders(orderToBeSaved)

    orderToSave.updatedAt = new Date()

    return await this.ordersRepository
      .findByIdAndUpdate(id, orderToSave, { new: true })
      .exec()
  }

  /**
   * Elimina un pedido
   * @param id El ID del pedido
   */
  async remove(id: string) {
    this.logger.log(`Eliminando pedido con id ${id}`)

    const orderToDelete = await this.ordersRepository.findById(id).exec()
    if (!orderToDelete) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`)
    }
    await this.returnStockOrders(orderToDelete)
    await this.ordersRepository.findByIdAndDelete(id).exec()
  }

  /**
   * Comprueba si existe un usuario
   * @param userId El ID del usuario
   */

  async userExists(userId: string): Promise<boolean> {
    this.logger.log(`Comprobando si existe el usuario ${userId}`)
    const user = await this.usersRepository.findOneBy({ id: userId })
    return !!user
  }

  /**
   * Busca todos los pedidos de un usuario
   * @param userId El ID del usuario
   */
  async getOrdersByUser(userId: string): Promise<Order[]> {
    this.logger.log(`Buscando pedidos por usuario ${userId}`)
    return await this.ordersRepository.find({ userId: userId }).exec()
  }

  /**
   * Comprueba si un pedido es válido
   * @param order El pedido a comprobar
   * @private Método privado
   */
  private async checkOrder(order: Order): Promise<void> {
    this.logger.log(`Comprobando pedido ${JSON.stringify(order)}`)
    if (!order.orderLines || order.orderLines.length === 0) {
      throw new BadRequestException(
        'No se han agregado líneas de pedido al pedido actual',
      )
    }

    for (const orderLine of order.orderLines) {
      const funko = await this.funkosRepository.findOneBy({
        id: orderLine.productId,
      })
      if (!funko) {
        throw new BadRequestException(
          `El Funko con id ${orderLine.productId} no existe`,
        )
      }
      if (funko.stock < orderLine.stock && orderLine.stock > 0) {
        throw new BadRequestException(
          `La cantidad solicitada no es válida o no hay suficiente stock del Funko ${funko.id}`,
        )
      }
      if (funko.price !== orderLine.productPrice) {
        throw new BadRequestException(
          `El precio del Funko ${funko.id} en el pedido no coincide con el precio actual del Funko`,
        )
      }
    }
  }

  /**
   * Reserva el stock de un pedido
   * @param order El pedido a reservar
   * @private Método privado
   */
  private async reserveStockOrders(order: Order): Promise<Order> {
    this.logger.log(`Reservando stock del pedido: ${order}`)

    if (!order.orderLines || order.orderLines.length === 0) {
      throw new BadRequestException(`No se han agregado lineas de pedidos`)
    }

    for (const orderLine of order.orderLines) {
      const funko = await this.funkosRepository.findOneBy({
        id: orderLine.productId,
      })

      funko.stock -= orderLine.stock
      await this.funkosRepository.save(funko)
      orderLine.total = orderLine.stock * orderLine.productPrice
    }

    order.total = order.orderLines.reduce(
      (sum, orderLine) => sum + orderLine.stock * orderLine.productPrice,
      0,
    )
    order.totalItems = order.orderLines.reduce(
      (sum, orderLine) => sum + orderLine.stock,
      0,
    )

    return order
  }

  /**
   * Devuelve el stock de un pedido
   * @param order El pedido a devolver
   * @private Método privado
   */
  private async returnStockOrders(order: Order): Promise<Order> {
    this.logger.log(`Retornando stock del pedido: ${order}`)
    if (order.orderLines) {
      for (const orderLine of order.orderLines) {
        const funko = await this.funkosRepository.findOneBy({
          id: orderLine.productId,
        })
        funko.stock += orderLine.stock
        await this.funkosRepository.save(funko)
      }
    }
    return order
  }
}
