import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Category } from '../../categories/entities/category.entity'

/**
 * Entity Funko
 */
@Entity('funkos')
export class Funko {
  public static IMAGE_DEFAULT = 'empty.png'

  @PrimaryColumn({ type: 'uuid' })
  id: string

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string

  @Column({ type: 'double precision', default: 0.0 })
  price: number

  @Column({ type: 'integer', default: 0 })
  stock: number

  @Column({ type: 'text', default: Funko.IMAGE_DEFAULT })
  image: string

  @ManyToOne(() => Category, (category) => category.funkos)
  @JoinColumn({ name: 'category_id' })
  category: Category

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean
}
