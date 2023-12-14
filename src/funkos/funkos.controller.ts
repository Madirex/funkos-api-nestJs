import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  Logger,
} from '@nestjs/common'
import { FunkosService } from './funkos.service'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { UpdateFunkoDto } from './dto/update-funko.dto'
@Controller('funkos')
export class FunkosController {
  private readonly logger = new Logger(FunkosController.name)
  constructor(private readonly funkosService: FunkosService) {}

  @Get()
  @HttpCode(200)
  async findAll() {
    this.logger.log('Obteniendo todos los Funkos')
    return await this.funkosService.findAll()
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    this.logger.log(`Obteniendo Funko por id: ${id}`)
    return await this.funkosService.findOne(id)
  }
  @Post()
  @HttpCode(201)
  async create(@Body() createFunkoDto: CreateFunkoDto) {
    this.logger.log(
      `Creando Funko con datos: ${JSON.stringify(createFunkoDto)}`,
    )
    return await this.funkosService.create(createFunkoDto)
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateFunkoDto: UpdateFunkoDto,
  ) {
    this.logger.log(
      `Actualizando Funko con datos: ${JSON.stringify(updateFunkoDto)}`,
    )
    return await this.funkosService.update(id, updateFunkoDto)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    this.logger.log(`Eliminando Funko con id: ${id}`)
    return await this.funkosService.remove(id)
  }
}
