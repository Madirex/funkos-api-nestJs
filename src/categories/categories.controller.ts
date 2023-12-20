import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Logger,
  Put,
} from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Controller('categories')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name)
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @HttpCode(200)
  async findAll() {
    this.logger.log('Obteniendo todas las categorías')
    return await this.categoriesService.findAll()
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: number) {
    this.logger.log(`Obteniendo categoría por id: ${id}`)
    return await this.categoriesService.findOne(+id)
  }
  @Post()
  @HttpCode(201)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    this.logger.log(
      `Creando categoría con datos: ${JSON.stringify(createCategoryDto)}`,
    )
    return await this.categoriesService.create(createCategoryDto)
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    this.logger.log(
      `Actualizando categoría ${id} con datos: ${JSON.stringify(
        updateCategoryDto,
      )}`,
    )
    return await this.categoriesService.update(+id, updateCategoryDto)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: number) {
    this.logger.log(`Eliminando categoría con id: ${id}`)
    return await this.categoriesService.remove(+id)
  }
}
