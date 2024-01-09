import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException, BadRequestException } from '@nestjs/common';
import * as request from 'supertest';
import { FunkosController } from '../../../src/funkos/controller/funkos.controller';
import { FunkosService } from '../../../src/funkos/service/funkos.service';
import { CreateFunkoDto } from '../../../src/funkos/dto/create-funko.dto';
import { UpdateFunkoDto } from '../../../src/funkos/dto/update-funko.dto';

describe('FunkosController (e2e)', () => {
    let app: INestApplication;
    const endpoint = '/funkos';

    const testFunkoId = '1';
    const testFunko = {
        id: testFunkoId,
        name: 'Funko1',
        description: 'Awesome Funko',
    };

    const createFunkoDto: CreateFunkoDto = {
        name: 'Funko1',
    };

    const updateFunkoDto: UpdateFunkoDto = {
    };

    const mockFunkosService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [FunkosController],
            providers: [
                FunkosService,
                { provide: FunkosService, useValue: mockFunkosService },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /funkos', () => {
        it('debería retornar todos los Funkos', async () => {
            mockFunkosService.findAll.mockResolvedValue([testFunko]);

            const { body } = await request(app.getHttpServer())
                .get(endpoint)
                .expect(200);

            expect(body).toEqual([testFunko]);
            expect(mockFunkosService.findAll).toHaveBeenCalled();
        });
    });

    describe('GET /funkos/:id', () => {
        it('debería retornar el Funko por su ID', async () => {
            mockFunkosService.findOne.mockResolvedValue(testFunko);

            const { body } = await request(app.getHttpServer())
                .get(`${endpoint}/${testFunkoId}`)
                .expect(200);

            expect(body).toEqual(testFunko);
            expect(mockFunkosService.findOne).toHaveBeenCalledWith(testFunkoId);
        });

        it('debería retornar un error 404 si el Funko no se encuentra', async () => {
            mockFunkosService.findOne.mockRejectedValue(new NotFoundException());

            await request(app.getHttpServer())
                .get(`${endpoint}/${testFunkoId}`)
                .expect(404);
        });
    });

    describe('POST /funkos', () => {
        it('debería crear un nuevo Funko', async () => {
            mockFunkosService.create.mockResolvedValue(testFunko);

            const { body } = await request(app.getHttpServer())
                .post(endpoint)
                .send(createFunkoDto)
                .expect(201);

            expect(body).toEqual(testFunko);
            expect(mockFunkosService.create).toHaveBeenCalledWith(createFunkoDto);
        });
    });

    describe('PUT /funkos/:id', () => {
        it('debería actualizar un Funko', async () => {
            mockFunkosService.update.mockResolvedValue(testFunko);

            const { body } = await request(app.getHttpServer())
                .put(`${endpoint}/${testFunkoId}`)
                .send(updateFunkoDto)
                .expect(200);

            expect(body).toEqual(testFunko);
            expect(mockFunkosService.update).toHaveBeenCalledWith(
                testFunkoId,
                updateFunkoDto,
            );
        });

        it('debería retornar un error 404 si el Funko no existe', async () => {
            mockFunkosService.update.mockRejectedValue(new NotFoundException());
            await request(app.getHttpServer())
                .put(`${endpoint}/${testFunkoId}`)
                .send(updateFunkoDto)
                .expect(404);
        });

        it('debería retornar un error 400 debido a datos incorrectos', async () => {
            mockFunkosService.update.mockRejectedValue(new BadRequestException());
            await request(app.getHttpServer())
                .put(`${endpoint}/${testFunkoId}`)
                .send(updateFunkoDto)
                .expect(400);
        });
    });

    describe('DELETE /funkos/:id', () => {
        it('debería eliminar el Funko', async () => {
            mockFunkosService.remove.mockResolvedValue(testFunko);

            await request(app.getHttpServer())
                .delete(`${endpoint}/${testFunkoId}`)
                .expect(204);
        });

        it('debería retornar un error 400 por Bad Request', async () => {
            mockFunkosService.remove.mockRejectedValue(new BadRequestException());
            await request(app.getHttpServer())
                .put(`${endpoint}/${testFunkoId}`)
                .send(updateFunkoDto)
                .expect(400);
        });
    });
});
