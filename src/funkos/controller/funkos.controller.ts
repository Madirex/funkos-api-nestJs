import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FunkosService } from '../service/funkos.service'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { UpdateFunkoDto } from '../dto/update-funko.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { Request } from 'express'
import { Util } from '../../util/util'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'

/**
 * Controlador de Funkos
 */
@Controller('funkos')
@UseInterceptors(CacheInterceptor)
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
  @CacheKey('all_funkos')
  @CacheTTL(30)
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

  /**
   * Actualiza la imagen de un Funko
   * @param id Identificador del Funko
   * @param file Fichero de imagen
   * @param req Request
   */
  @Patch('/image/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOADS_DIR || './storage-dir',
        filename: (req, file, cb) => {
          const dateTime = Util.getCurrentDateTimeString()
          const uuid = req.params.id
          const fileName = `${uuid}-${dateTime}`
          const fileExt = extname(file.originalname)
          cb(null, `${fileName}${fileExt}`)
        },
      }),
    }),
  )
  async updateImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    this.logger.log(`Actualizando imagen al Funko con id ${id}:  ${file}`)

    const allowedMimes = ['image/jpeg', 'image/png']
    const maxFileSizeInBytes = 1024 * 1024 // 1 megabyte
    if (file === undefined) throw new BadRequestException('Fichero no enviado')
    else if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Fichero no soportado. No es del tipo imagen válido',
      )
    } else if (file.mimetype != Util.detectFileType(file)) {
      throw new BadRequestException(
        'Fichero no soportado. No es del tipo imagen válido',
      )
    } else if (file.size > maxFileSizeInBytes) {
      throw new BadRequestException(
        `El tamaño del archivo no puede ser mayor a ${maxFileSizeInBytes} bytes.`,
      )
    }
    return await this.funkosService.updateImage(id, file, req, true)
  }
}
