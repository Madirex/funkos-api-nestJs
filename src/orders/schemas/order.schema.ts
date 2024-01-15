import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'

/**
 * Address Class
 */
export class Address {
  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  street: string

  @Prop({
    type: String,
    required: true,
    length: 50,
    default: '',
  })
  number: string

  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  city: string

  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  province: string

  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  country: string

  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  postalCode: string
}

/**
 * Client Class
 */
export class Client {
  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  fullName: string

  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  email: string

  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  phone: string

  @Prop({
    required: true,
  })
  address: Address
}

/**
 * OrderLine Class
 */
export class OrderLine {
  @Prop({
    type: Number,
    required: true,
  })
  productId: number

  @Prop({
    type: Number,
    required: true,
  })
  productPrice: number

  @Prop({
    type: Number,
    required: true,
  })
  stock: number

  @Prop({
    type: Number,
    required: true,
  })
  quantity: number
}

/**
 * Order Class
 */
@Schema({
  collection: 'orders',
  timestamps: false,
  versionKey: false,
  id: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v
      ret.id = ret._id
      delete ret._id
      delete ret._class
    },
  },
})
export class Order {
  @Prop({
    type: Number,
    required: true,
  })
  userId: number

  @Prop({
    required: true,
  })
  client: Client

  @Prop({
    required: true,
  })
  orderLines: OrderLine[]

  @Prop()
  totalItems: number

  @Prop()
  quantity: number

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date

  @Prop({ default: false })
  isDeleted: boolean
}

export type OrderDocument = Order & Document
export const OrderSchema = SchemaFactory.createForClass(Order)
OrderSchema.plugin(mongoosePaginate)
