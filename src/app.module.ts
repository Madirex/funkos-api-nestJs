import { Module } from '@nestjs/common'
import { FunkosModule } from './funkos/funkos.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriesModule } from './categories/categories.module'

/**
 * Módulo principal de la aplicación
 */
@Module({
  imports: [
    FunkosModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password123',
      database: 'FUNKOS_DB',
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      synchronize: true,
    }),
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})

/**
 * Módulo principal de la aplicación
 */
export class AppModule {}
