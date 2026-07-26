import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RequisitionsService } from './requisitions.service';
import { Requisition } from './entities/requisition.entity';
import { SettingsService } from '../settings/settings.service';
import { NotFoundException } from '@nestjs/common';
import { ILike } from 'typeorm';

const mockRequisitionsRepo = {
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
};

const mockSettingsService = {
  getValue: jest.fn(),
};

describe('RequisitionsService', () => {
  let service: RequisitionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequisitionsService,
        { provide: getRepositoryToken(Requisition), useValue: mockRequisitionsRepo },
        { provide: SettingsService, useValue: mockSettingsService },
      ],
    }).compile();

    service = module.get<RequisitionsService>(RequisitionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated requisitions without search', async () => {
      mockRequisitionsRepo.findAndCount.mockResolvedValue([[{ id: '1' }], 1]);
      const result = await service.findAll({ page: 2, limit: 5 });
      expect(result.data).toHaveLength(1);
      expect(result.meta.page).toBe(2);
      expect(mockRequisitionsRepo.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
        where: {},
        take: 5,
        skip: 5
      }));
    });

    it('should filter when search is provided', async () => {
      mockRequisitionsRepo.findAndCount.mockResolvedValue([[], 0]);
      await service.findAll({ search: 'Company A' });
      expect(mockRequisitionsRepo.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.arrayContaining([{ companyName: ILike('%Company A%') }])
      }));
    });
  });

  describe('findOne', () => {
    it('should return requisition by id', async () => {
      mockRequisitionsRepo.findOne.mockResolvedValue({ id: '1' });
      const result = await service.findOne('1');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if not found', async () => {
      mockRequisitionsRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a requisition', async () => {
      mockRequisitionsRepo.create.mockImplementation((entity) => ({ id: 'new-id', ...entity }));
      mockRequisitionsRepo.save.mockImplementation((entity) => Promise.resolve(entity));

      const result = await service.create({ activity: 'New Activity' } as any);
      
      expect(result.activity).toBe('New Activity');
      expect(mockRequisitionsRepo.create).toHaveBeenCalledWith({ activity: 'New Activity' });
      expect(mockRequisitionsRepo.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should merge and save updated requisition', async () => {
      const existing = { id: '1', activity: 'Old' };
      const updated = { id: '1', activity: 'New' };
      mockRequisitionsRepo.findOne.mockResolvedValue(existing);
      mockRequisitionsRepo.merge.mockReturnValue(updated);
      mockRequisitionsRepo.save.mockResolvedValue(updated);

      const result = await service.update('1', { activity: 'New' } as any);
      expect(result.activity).toBe('New');
      expect(mockRequisitionsRepo.merge).toHaveBeenCalledWith(existing, { activity: 'New' });
      expect(mockRequisitionsRepo.save).toHaveBeenCalledWith(updated);
    });

    it('should throw if updating non-existent requisition', async () => {
      mockRequisitionsRepo.findOne.mockResolvedValue(null);
      await expect(service.update('invalid', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove existing requisition', async () => {
      const existing = { id: '1' };
      mockRequisitionsRepo.findOne.mockResolvedValue(existing);
      mockRequisitionsRepo.remove.mockResolvedValue(existing);

      await service.remove('1');
      expect(mockRequisitionsRepo.remove).toHaveBeenCalledWith(existing);
    });

    it('should throw if removing non-existent requisition', async () => {
      mockRequisitionsRepo.findOne.mockResolvedValue(null);
      await expect(service.remove('invalid')).rejects.toThrow(NotFoundException);
    });
  });
});
