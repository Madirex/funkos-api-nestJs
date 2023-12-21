import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { FunkosController } from './funkos.controller'
import { FunkosService } from '../service/funkos.service'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { UpdateFunkoDto } from '../dto/update-funko.dto'
import { Funko } from '../entities/funko.entity'
import { CategoryType } from '../../categories/entities/category.entity'
import { v4 as uuidv4 } from 'uuid'

describe('FunkosController', () => {
  let controller: FunkosController
  let service: FunkosService

  const funkosServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FunkosController],
      providers: [{ provide: FunkosService, useValue: funkosServiceMock }],
    }).compile()

    controller = module.get<FunkosController>(FunkosController)
    service = module.get<FunkosService>(FunkosService)
  })

  it('debería estar definido', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    const date = new Date()
    it('debería retornar todos los Funkos', async () => {
      const testFunkos: Funko[] = [
        {
          id: '1',
          name: 'Funko1',
          price: 100,
          stock: 10,
          image: 'test',
          category: {
            id: 1,
            name: 'test',
            categoryType: CategoryType.OTHER,
            createdAt: date,
            updatedAt: date,
            isActive: true,
            funkos: [],
          },
          createdAt: date,
          updatedAt: date,
          isActive: true,
        },
      ]

      jest.spyOn(service, 'findAll').mockResolvedValue(testFunkos)
      const result: Funko[] = await controller.findAll()

      expect(result).toEqual(testFunkos)
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    const date = new Date()
    it('debería de recibir el Funko dado el ID', async () => {
      const id = uuidv4()
      const mockResult: Funko = {
        id: id,
        name: 'Funko1',
        price: 100,
        stock: 10,
        image: 'test',
        category: {
          id: 1,
          name: 'test',
          categoryType: CategoryType.OTHER,
          createdAt: date,
          updatedAt: date,
          isActive: true,
          funkos: [],
        },
        createdAt: date,
        updatedAt: date,
        isActive: true,
      }

      jest.spyOn(service, 'findOne').mockResolvedValue(mockResult)
      await controller.findOne(id)

      expect(service.findOne).toHaveBeenCalledWith(id)
      expect(mockResult).toEqual({
        id,
        name: 'Funko1',
        price: 100,
        stock: 10,
        image: 'test',
        category: {
          id: 1,
          name: 'test',
          categoryType: CategoryType.OTHER,
          createdAt: date,
          updatedAt: date,
          isActive: true,
          funkos: [],
        },
        createdAt: date,
        updatedAt: date,
        isActive: true,
      })
    })

    it('debería hacer un throw NotFoundException porque el Funko no existe', async () => {
      const id = uuidv4()
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException())
      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    const date = new Date()
    it('debería de crear un  Funko', async () => {
      const id = uuidv4()
      const dto: CreateFunkoDto = { name: 'Funko1' }
      const mockResult: Funko = {
        id: id,
        name: 'Funko1',
        price: 100,
        stock: 10,
        image: 'test',
        category: {
          id: 1,
          name: 'test',
          categoryType: CategoryType.OTHER,
          createdAt: date,
          updatedAt: date,
          isActive: true,
          funkos: [],
        },
        createdAt: date,
        updatedAt: date,
        isActive: true,
      }

      jest.spyOn(service, 'create').mockResolvedValue(mockResult)
      await controller.create(dto)

      expect(service.create).toHaveBeenCalledWith(dto)
      expect(mockResult).toEqual({
        id: id,
        name: 'Funko1',
        price: 100,
        stock: 10,
        image: 'test',
        category: {
          id: 1,
          name: 'test',
          categoryType: CategoryType.OTHER,
          createdAt: date,
          updatedAt: date,
          isActive: true,
          funkos: [],
        },
        createdAt: date,
        updatedAt: date,
        isActive: true,
      })
    })
  })

  describe('update', () => {
    const date = new Date()
    it('debería de actualizar el Funko', async () => {
      const id = uuidv4()
      const dto: UpdateFunkoDto = { name: 'UpdatedFunko' }
      const mockResult: Funko = {
        id: id,
        name: 'UpdatedFunko',
        price: 100,
        stock: 10,
        image: 'test',
        category: {
          id: 1,
          name: 'test',
          categoryType: CategoryType.OTHER,
          createdAt: date,
          updatedAt: date,
          isActive: true,
          funkos: [],
        },
        createdAt: date,
        updatedAt: date,
        isActive: true,
      }

      jest.spyOn(service, 'update').mockResolvedValue(mockResult)
      await controller.update(id, dto)

      expect(service.update).toHaveBeenCalledWith(id, dto)
      expect(mockResult).toEqual({
        id,
        name: 'UpdatedFunko',
        price: 100,
        stock: 10,
        image: 'test',
        category: {
          id: 1,
          name: 'test',
          categoryType: CategoryType.OTHER,
          createdAt: date,
          updatedAt: date,
          isActive: true,
          funkos: [],
        },
        createdAt: date,
        updatedAt: date,
        isActive: true,
      })
    })

    it('debería hacer throw NotFoundException porque el Funko no existe', async () => {
      const id = uuidv4()
      const dto: UpdateFunkoDto = { name: 'UpdatedFunko' }
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException())
      await expect(controller.update(id, dto)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('remove', () => {
    const date = new Date()
    it('debería eliminar un Funko', async () => {
      const id = uuidv4()
      const mockResult: Funko = {
        id: id,
        name: 'Funko1',
        price: 100,
        stock: 10,
        image: 'test',
        category: {
          id: 1,
          name: 'test',
          categoryType: CategoryType.OTHER,
          createdAt: date,
          updatedAt: date,
          isActive: true,
          funkos: [],
        },
        createdAt: date,
        updatedAt: date,
        isActive: true,
      }

      jest.spyOn(service, 'remove').mockResolvedValue(mockResult)
      await controller.remove(id)

      expect(service.remove).toHaveBeenCalledWith(id)
      expect(mockResult).toEqual({
        id,
        name: 'Funko1',
        price: 100,
        stock: 10,
        image: 'test',
        category: {
          id: 1,
          name: 'test',
          categoryType: CategoryType.OTHER,
          createdAt: date,
          updatedAt: date,
          isActive: true,
          funkos: [],
        },
        createdAt: date,
        updatedAt: date,
        isActive: true,
      })
    })

    it('debería lanzarse un throw NotFoundException porque el Funko no existe', async () => {
      const id = '1'
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException())
      await expect(controller.remove(id)).rejects.toThrow(NotFoundException)
    })
  })
})