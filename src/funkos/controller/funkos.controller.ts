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
import { FunkosService } from '../service/funkos.service'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { UpdateFunkoDto } from '../dto/update-funko.dto'

/**
 * Controlador de Funkos
 */
@Controller('funkos')
export class FunkosController {
  private readonly logger = new Logger(FunkosController.name)

  /**
   * Constructor
   * @param funkosService Servicio de Funkos
   */
  constructor(private readonly funkosService: FunkosService) {}

  /**
   * Obtiene todos los Funkos
   * @returns Arreglo con todos los Funkos
   * @example http://localhost:3000/v1/funkos
   */
  @Get()
  @HttpCode(200)
  async findAll() {
    this.logger.log('Obteniendo todos los Funkos')
    return await this.funkosService.findAll()
  }

  /**
   * Obtiene un Funko dado el ID
   * @param id Identificador del Funko
   * @returns Funko encontrado
   * @example http://localhost:3000/v1/funkos/1
   */
  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    this.logger.log(`Obteniendo Funko por id: ${id}`)
    return await this.funkosService.findOne(id)
  }

  /**
   * Crea un Funko
   * @param createFunkoDto DTO de creación de Funko
   * @returns Funko creado
   * @example http://localhost:3000/v1/funkos
   */
  @Post()
  @HttpCode(201)
  async create(@Body() createFunkoDto: CreateFunkoDto) {
    this.logger.log(
      `Creando Funko con datos: ${JSON.stringify(createFunkoDto)}`,
    )
    return await this.funkosService.create(createFunkoDto)
  }

  /**
   * Actualiza un Funko dado el ID
   * @param id Identificador del Funko
   * @param updateFunkoDto DTO de actualización de Funko
   * @returns Funko actualizado
   * @example http://localhost:3000/v1/funkos/1
   */
  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateFunkoDto: UpdateFunkoDto,
  ) {
    this.logger.log(
      `Actualizando Funko ${id} con datos: ${JSON.stringify(updateFunkoDto)}`,
    )
    return await this.funkosService.update(id, updateFunkoDto)
  }

  /**
   * Elimina un Funko dado el ID
   * @param id Identificador del Funko
   * @returns Funko eliminado
   * @example http://localhost:3000/v1/funkos/1
   */
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    this.logger.log(`Eliminando Funko con id: ${id}`)
    return await this.funkosService.remove(id)
  }
}
