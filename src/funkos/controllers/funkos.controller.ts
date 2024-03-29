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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FunkosService } from '.././services/funkos.service'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { UpdateFunkoDto } from '../dto/update-funko.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { Request } from 'express'
import { Util } from '../../util/util'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { Roles, RolesAuthGuard } from '../../auth/guards/roles-auth.guard'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ResponseFunkoDto } from '../dto/response-funko.dto'

/**
 * Controlador de Funkos
 */
@Controller('funkos')
@UseInterceptors(CacheInterceptor)
@ApiTags('Funkos')
export class FunkosController {
  private readonly logger = new Logger(FunkosController.name)

  /**
   * Constructor
   * @param funkosService Servicio de Funkos
   */
  constructor(private readonly funkosService: FunkosService) {}

  /**
   * Obtiene todos los Funkos
   * @param query Query de paginación
   * @returns Arreglo con todos los Funkos
   * @example http://localhost:3000/v1/funkos
   */
  @Get()
  @CacheKey('all_funkos')
  @CacheTTL(30)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description:
      'Lista de Funkos paginada. Se puede filtrar por límite, página sortBy, filter y search',
    type: Paginated<ResponseFunkoDto>,
  })
  @ApiQuery({
    description: 'Filtro por límite por página',
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    description: 'Filtro por página',
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    description: 'Filtro de ordenación: campo:ASC|DESC',
    name: 'sortBy',
    required: false,
    type: String,
  })
  @ApiQuery({
    description: 'Filtro de búsqueda: filter.campo = $eq:valor',
    name: 'filter',
    required: false,
    type: String,
  })
  @ApiQuery({
    description: 'Filtro de búsqueda: search = valor',
    name: 'search',
    required: false,
    type: String,
  })
  async findAll(@Paginate() query: PaginateQuery) {
    this.logger.log('Obteniendo todos los Funkos')
    return await this.funkosService.findAll(query)
  }

  /**
   * Obtiene un Funko dado el ID
   * @param id Identificador del Funko
   * @returns Funko encontrado
   * @example http://localhost:3000/v1/funkos/1
   */
  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Funko encontrado',
    type: ResponseFunkoDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del Funko',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'Funko no encontrado',
  })
  @ApiBadRequestResponse({
    description: 'El id del Funko no es válido',
  })
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
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Funko creado',
    type: ResponseFunkoDto,
  })
  @ApiBody({
    description: 'Datos del Funko a crear',
    type: CreateFunkoDto,
  })
  @ApiBadRequestResponse({
    description:
      'En algunos de los campos no es válido según la especificación del DTO',
  })
  @ApiBadRequestResponse({
    description: 'La categoría no existe o no es válida',
  })
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
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Funko actualizado',
    type: ResponseFunkoDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del Funko',
    type: String,
  })
  @ApiBody({
    description: 'Datos del Funko a actualizar',
    type: UpdateFunkoDto,
  })
  @ApiNotFoundResponse({
    description: 'Funko no encontrado',
  })
  @ApiBadRequestResponse({
    description:
      'En algunos de los campos no es válido según la especificación del DTO',
  })
  @ApiBadRequestResponse({
    description: 'La categoría no existe o no es válida',
  })
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
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'Funko eliminado',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del Funko',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'Funko no encontrado',
  })
  @ApiBadRequestResponse({
    description: 'El id del Funko no es válido',
  })
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
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Imagen actualizada',
    type: ResponseFunkoDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del Funko',
    type: String,
  })
  @ApiProperty({
    name: 'file',
    description: 'Fichero de imagen',
    type: 'string',
    format: 'binary',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Fichero de imagen',
    type: FileInterceptor('file'),
  })
  @ApiNotFoundResponse({
    description: 'Funko no encontrado',
  })
  @ApiBadRequestResponse({
    description: 'El id del Funko no es válido',
  })
  @ApiBadRequestResponse({
    description: 'El fichero no es válido o es de un tipo no soportado',
  })
  @ApiBadRequestResponse({
    description: 'El fichero no puede ser mayor a 1 megabyte',
  })
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
    else if (
      !allowedMimes.includes(file.mimetype) ||
      file.mimetype != Util.detectFileType(file)
    ) {
      throw new BadRequestException(
        'Fichero no soportado. No es del tipo imagen válido',
      )
    } else if (file.size > maxFileSizeInBytes) {
      throw new BadRequestException(
        `El tamaño del archivo no puede ser mayor a ${maxFileSizeInBytes} bytes.`,
      )
    }
    return await this.funkosService.updateImage(id, file, req, false)
  }
}
