import { Module } from '@nestjs/common'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { Order } from './schemas/order.schema'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheModule } from '@nestjs/cache-manager'
import { Funko } from '../funkos/entities/funko.entity'
import { OrdersController } from './controllers/orders.controller'
import { OrdersService } from './services/orders.service'
import { OrdersMapper } from './mappers/orders.mapper'
import { User } from '../users/entities/user.entity'

/**
 * @description The Orders Module
 */
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Order.name,
        useFactory: () => {
          const schema = SchemaFactory.createForClass(Order)
          schema.plugin(mongoosePaginate)
          return schema
        },
      },
    ]),
    TypeOrmModule.forFeature([Funko]),
    TypeOrmModule.forFeature([User]),
    CacheModule.register(),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersMapper],
  exports: [OrdersService],
})
export class OrdersModule {}
