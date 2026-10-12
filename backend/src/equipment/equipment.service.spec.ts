import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EquipmentService } from './equipment.service';
import { Equipment } from './entities/equipment.entity';
import { EquipmentReception } from './entities/equipment-reception.entity';
import { Client } from '../clients/entities/client.entity';
import { Quote } from '../quotes/entities/quote.entity';
import { ExcelService } from '../common/excel/excel.service';
import { NotFoundException } from '@nestjs/common';
import { ILike } from 'typeorm';

const mockEquipmentRepo = {
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  query: jest.fn(),
};

const mockReceptionRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockClientRepo = {
  findOne: jest.fn(),
};

const mockQuoteRepo = {};

const mockExcelService = {
  exportToExcel: jest.fn(),
  importFromExcel: jest.fn(),
};

describe('EquipmentService', () => {
  let service: EquipmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EquipmentService,
        { provide: getRepositoryToken(Equipment), useValue: mockEquipmentRepo },
        { provide: getRepositoryToken(EquipmentReception), useValue: mockReceptionRepo },
        { provide: getRepositoryToken(Client), useValue: mockClientRepo },
        { provide: getRepositoryToken(Quote), useValue: mockQuoteRepo },
        { provide: ExcelService, useValue: mockExcelService },
      ],
    }).compile();

    service = module.get<EquipmentService>(EquipmentService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated equipment without search', async () => {
      mockEquipmentRepo.findAndCount.mockResolvedValue([[{ id: '1' }], 1]);
      const result = await service.findAll({ page: 2, limit: 5 });
      expect(result.data).toHaveLength(1);
      expect(result.meta.page).toBe(2);
      expect(mockEquipmentRepo.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
        take: 5, skip: 5, where: {}
      }));
    });

    it('should apply filters if search is provided', async () => {
      mockEquipmentRepo.findAndCount.mockResolvedValue([[], 0]);
      await service.findAll({ search: 'Balanza' });
      expect(mockEquipmentRepo.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.arrayContaining([
          { brand: ILike('%Balanza%') },
          { model: ILike('%Balanza%') }
        ])
      }));
    });
  });

  describe('findOne', () => {
    it('should return equipment by id', async () => {
      mockEquipmentRepo.findOne.mockResolvedValue({ id: '1' });
      const result = await service.findOne('1');
      expect(result.id).toBe('1');
    });

    it('should throw an error if not found', async () => {
      mockEquipmentRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create equipment with code from the Postgres sequence', async () => {
      mockEquipmentRepo.query.mockResolvedValue([{ nextval: 151 }]);
      mockEquipmentRepo.create.mockImplementation((entity) => ({ id: 'new-id', ...entity }));
      mockEquipmentRepo.save.mockImplementation((entity) => Promise.resolve(entity));

      const result = await service.create({ brand: 'Test', clientId: 'c1' } as any, 'user1');

      expect(result.internalCode).toBe(`EQ-${new Date().getFullYear()}-0151`);
    });

    it('should create equipment with code 0001 when the sequence starts at 1', async () => {
      mockEquipmentRepo.query.mockResolvedValue([{ nextval: 1 }]);
      mockEquipmentRepo.create.mockImplementation((entity) => ({ id: 'new-id', ...entity }));
      mockEquipmentRepo.save.mockImplementation((entity) => Promise.resolve(entity));

      const result = await service.create({ brand: 'Test', clientId: 'c1' } as any, 'user1');
      expect(result.internalCode).toBe(`EQ-${new Date().getFullYear()}-0001`);
    });
  });

  describe('update', () => {
    it('should update equipment', async () => {
      mockEquipmentRepo.findOne.mockResolvedValue({ id: '1', brand: 'Old' });
      mockEquipmentRepo.save.mockImplementation(e => e);

      const result = await service.update('1', { brand: 'New' } as any);
      expect(result.brand).toBe('New');
    });
  });
});
