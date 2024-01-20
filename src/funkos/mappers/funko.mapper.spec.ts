import { Test, TestingModule } from '@nestjs/testing'
import {
  Category,
  CategoryType,
} from '../../categories/entities/category.entity'
import { FunkoMapper } from './funko.mapper'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { Funko } from '../entities/funko.entity'
import { UpdateFunkoDto } from '../dto/update-funko.dto'

describe('FunkoMapper', () => {
  let funkoMapper: FunkoMapper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FunkoMapper],
    }).compile()

    funkoMapper = module.get<FunkoMapper>(FunkoMapper)
  })

  it('debe de estar definido', () => {
    expect(funkoMapper).toBeDefined()
  })

  describe('toEntity', () => {
    it('el mapeo de CreateFunkoDto a entidad Funko debe de tener la imagen por defecto si no es proporcionada', () => {
      // Arrange
      const createFunkoDto: CreateFunkoDto = {
        name: 'SuperFunko',
      }

      const category: Category = {
        id: 1,
        categoryType: CategoryType.SERIES,
        name: 'Series',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        funkos: [],
      }

      // Act
      const actualFunkoEntity: Funko = funkoMapper.toEntity(
        createFunkoDto,
        category,
      )

      // Assert
      expect(actualFunkoEntity.name).toEqual(createFunkoDto.name.trim())
      expect(actualFunkoEntity.category).toEqual(category)
      expect(actualFunkoEntity.image).toEqual(Funko.IMAGE_DEFAULT)
    })

    it('Se debe de mapear CreateFunkoDto a entidad Funko', () => {
      // Arrange
      const createFunkoDto: CreateFunkoDto = {
        name: 'SuperFunko',
        image: 'funko-image.jpg',
      }

      const category: Category = {
        id: 1,
        categoryType: CategoryType.SERIES,
        name: 'Series',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        funkos: [],
      }

      // Act
      const actualFunkoEntity: Funko = funkoMapper.toEntity(
        createFunkoDto,
        category,
      )

      // Assert
      expect(actualFunkoEntity.name).toEqual(createFunkoDto.name.trim())
      expect(actualFunkoEntity.category).toEqual(category)
    })
  })

  describe('mapUpdateToEntity', () => {
    it('el mapeo de las propiedades debe de ser correcto', () => {
      // Arrange
      const updateFunkoDto: UpdateFunkoDto = {
        image: 'updated-image.jpg',
      }

      const existingFunko: Funko = {
        id: 'funko-id',
        name: 'Funko existente',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        price: 10.99,
        stock: 10,
        image: 'funko-image.jpg',
        category: {
          id: 1,
          categoryType: CategoryType.SERIES,
          name: 'Series',
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          funkos: [],
        },
      }

      // Act
      const actualFunkoEntity: Funko = funkoMapper.mapUpdateToEntity(
        updateFunkoDto,
        existingFunko,
        null,
      )

      // Assert
      expect(actualFunkoEntity.name).toEqual(
        updateFunkoDto.name ? updateFunkoDto.name.trim() : existingFunko.name,
      )
      expect(actualFunkoEntity.price).toEqual(
        updateFunkoDto.price || existingFunko.price,
      )
      expect(actualFunkoEntity.image).toEqual(updateFunkoDto.image.trim())
      expect(actualFunkoEntity.category).toEqual(
        updateFunkoDto.category || existingFunko.category,
      )
      expect(actualFunkoEntity.createdAt).toEqual(existingFunko.createdAt)
    })

    it('el mapeo de UpdateFunkoDto a entidad Funko se debe realizar', () => {
      // Arrange
      const updateFunkoDto: UpdateFunkoDto = {
        name: 'Funko Actualizado',
        price: 15.99,
      }

      const existingFunko: Funko = {
        id: 'funko-id',
        name: 'Funko existente',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        price: 10.99,
        stock: 10,
        image: 'funko-image.jpg',
        category: {
          id: 1,
          categoryType: CategoryType.SERIES,
          name: 'Series',
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          funkos: [],
        },
      }

      const category: Category = {
        id: 1,
        categoryType: CategoryType.SERIES,
        name: 'Series',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        funkos: [],
      }

      // Act
      const actualFunkoEntity: Funko = funkoMapper.mapUpdateToEntity(
        updateFunkoDto,
        existingFunko,
        category,
      )

      // Assert
      expect(actualFunkoEntity.name).toEqual(updateFunkoDto.name.trim())
      expect(actualFunkoEntity.price).toEqual(updateFunkoDto.price)
      expect(actualFunkoEntity.category).toEqual(category)
    })
  })
})
