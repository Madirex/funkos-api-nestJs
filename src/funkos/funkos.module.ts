import { Module } from '@nestjs/common'
import { FunkosService } from './service/funkos.service'
import { FunkosController } from './controller/funkos.controller'
import { FunkoMapper } from './mappers/funko.mapper'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Funko } from './entities/funko.entity'
import { Category } from '../categories/entities/category.entity'
import {StorageModule} from "../storage/storage.module";

/**
 * Módulo de Funkos
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Funko]),
    TypeOrmModule.forFeature([Category]),
    StorageModule,
  ],
  controllers: [FunkosController],
  providers: [FunkosService, FunkoMapper],
})
export class FunkosModule {}
