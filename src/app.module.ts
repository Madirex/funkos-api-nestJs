import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { FunkosModule } from './funkos/funkos.module'

@Module({
  imports: [ConfigModule.forRoot(), FunkosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
