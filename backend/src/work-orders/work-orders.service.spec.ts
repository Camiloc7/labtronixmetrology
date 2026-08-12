import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkOrdersService } from './work-orders.service';
import { WorkOrder } from './entities/work-order.entity';
import { WorkOrderItem, WorkOrderStatus } from './entities/work-order-item.entity';
import { StatusHistory } from './entities/status-history.entity';
import { Client } from '../clients/entities/client.entity';
import { Equipment } from '../equipment/entities/equipment.entity';
import { ExcelService } from '../common/excel/excel.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { WorkOrderPhoto } from './entities/work-order-photo.entity';
import { WorkOrdersGateway } from './work-orders.gateway';
import { NotFoundException } from '@nestjs/common';
import { ILike } from 'typeorm';
import * as fs from 'fs';

const mockWorkOrdersRepo = {
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

const mockWorkOrderItemsRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  count: jest.fn(),
  createQueryBuilder: jest.fn(),
};

const mockHistoryRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

const mockClientRepo = {
  findOne: jest.fn(),
};

const mockEquipmentRepo = {
  findOne: jest.fn(),
};

const mockExcelService = {
  exportToExcel: jest.fn(),
};

const mockCloudinaryService = {};
const mockGateway = {
  emitWorkOrderCreated: jest.fn(),
  emitItemStatusChanged: jest.fn(),
};

describe('WorkOrdersService', () => {
  let service: WorkOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkOrdersService,
        { provide: getRepositoryToken(WorkOrder), useValue: mockWorkOrdersRepo },
        { provide: getRepositoryToken(WorkOrderItem), useValue: mockWorkOrderItemsRepo },
        { provide: getRepositoryToken(StatusHistory), useValue: mockHistoryRepo },
        { provide: getRepositoryToken(Client), useValue: mockClientRepo },
        { provide: getRepositoryToken(Equipment), useValue: mockEquipmentRepo },
        { provide: getRepositoryToken(WorkOrderPhoto), useValue: {} },
        { provide: ExcelService, useValue: mockExcelService },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
        { provide: WorkOrdersGateway, useValue: mockGateway },
      ],
    }).compile();

    service = module.get<WorkOrdersService>(WorkOrdersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated work orders without search', async () => {
      mockWorkOrdersRepo.findAndCount.mockResolvedValue([[{ id: '1' }], 1]);
      const result = await service.findAll({ page: 2, limit: 5 });
      expect(result.data).toHaveLength(1);
      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(5);
    });

    it('should return filtered paginated work orders when search provided', async () => {
      mockWorkOrdersRepo.findAndCount.mockResolvedValue([[], 0]);
      await service.findAll({ search: 'OT-123' });
      expect(mockWorkOrdersRepo.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.arrayContaining([{ otNumber: ILike('%OT-123%') }])
      }));
    });
  });

  describe('findOne', () => {
    it('should return a work order by id', async () => {
      mockWorkOrdersRepo.findOne.mockResolvedValue({ id: '1' });
      const result = await service.findOne('1');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if not found', async () => {
      mockWorkOrdersRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a work order with mapped items', async () => {
      const dto = {
        otNumber: 'OT-123',
        items: [{ equipmentId: 'e1' }, { equipmentId: 'e2' }]
      };
      
      mockWorkOrderItemsRepo.create.mockReturnValue({});
      mockWorkOrdersRepo.create.mockImplementation(e => e);
      mockWorkOrdersRepo.save.mockResolvedValue({ id: '1', ...dto });

      const result = await service.create(dto as any);
      
      expect(mockWorkOrderItemsRepo.create).toHaveBeenCalledTimes(2);
      expect(mockWorkOrdersRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        otNumber: 'OT-123',
        items: [{}, {}]
      }));
      expect(mockWorkOrdersRepo.save).toHaveBeenCalled();
      expect(mockGateway.emitWorkOrderCreated).toHaveBeenCalledWith('1');
      expect(result.id).toBe('1');
    });
    
    it('should handle creation without items', async () => {
      const dto = { otNumber: 'OT-123' };
      mockWorkOrdersRepo.create.mockImplementation(e => e);
      mockWorkOrdersRepo.save.mockResolvedValue({ id: '1', ...dto });

      const result = await service.create(dto as any);
      expect(mockWorkOrderItemsRepo.create).not.toHaveBeenCalled();
      expect(mockWorkOrdersRepo.create).toHaveBeenCalledWith(expect.objectContaining({ items: [] }));
    });
  });

  describe('update', () => {
    it('should update a work order', async () => {
      mockWorkOrdersRepo.findOne.mockResolvedValue({ id: '1', otNumber: 'OT-OLD' });
      mockWorkOrdersRepo.save.mockImplementation(e => e);

      const result = await service.update('1', { activity: 'Updated Activity' } as any);
      expect(result.activity).toBe('Updated Activity');
      expect(result.otNumber).toBe('OT-OLD');
    });
  });

  describe('changeItemStatus', () => {
    it('should change item status and create history log', async () => {
      mockWorkOrderItemsRepo.findOne.mockResolvedValue({ id: 'item1', status: WorkOrderStatus.RECIBIDO });
      mockWorkOrderItemsRepo.save.mockResolvedValue({ id: 'item1', status: WorkOrderStatus.EN_PROCESO });
      mockHistoryRepo.create.mockReturnValue({});
      mockHistoryRepo.save.mockResolvedValue({});

      await service.changeItemStatus('item1', { status: WorkOrderStatus.EN_PROCESO, notes: 'test' } as any, 'user1');

      expect(mockWorkOrderItemsRepo.save).toHaveBeenCalledWith({ id: 'item1', status: WorkOrderStatus.EN_PROCESO });
      expect(mockHistoryRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        previousStatus: WorkOrderStatus.RECIBIDO,
        newStatus: WorkOrderStatus.EN_PROCESO,
        notes: 'test',
        changedById: 'user1',
        workOrderItemId: 'item1'
      }));
      expect(mockHistoryRepo.save).toHaveBeenCalled();
      expect(mockGateway.emitItemStatusChanged).toHaveBeenCalledWith(
        undefined,
        'item1',
        WorkOrderStatus.RECIBIDO,
        WorkOrderStatus.EN_PROCESO,
      );
    });

    it('should throw NotFoundException if item does not exist', async () => {
      mockWorkOrderItemsRepo.findOne.mockResolvedValue(null);
      await expect(service.changeItemStatus('invalid', { status: WorkOrderStatus.RECIBIDO } as any, 'u1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('should return correct total and grouped status stats', async () => {
      mockWorkOrderItemsRepo.count.mockResolvedValue(10);
      mockWorkOrderItemsRepo.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([{ status: 'RECIBIDO', count: 5 }, { status: 'ENTREGADO', count: 5 }])
      });

      const result = await service.getStats();
      expect(result.total).toBe(10);
      expect(result.byStatus).toHaveLength(2);
    });
  });

  describe('exportToExcel', () => {
    it('should delegate export to excel service mapping relations', async () => {
      mockWorkOrderItemsRepo.find.mockResolvedValue([
        { workOrder: { otNumber: 'OT-1' }, equipment: { brand: 'B1', internalCode: 'EQ-1' }, status: 'RECIBIDO' }
      ]);
      mockExcelService.exportToExcel.mockResolvedValue(Buffer.from('excel-data'));

      const result = await service.exportToExcel();
      
      expect(mockWorkOrderItemsRepo.find).toHaveBeenCalled();
      expect(mockExcelService.exportToExcel).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ OT: 'OT-1', Estado: 'RECIBIDO', CodigoEquipo: 'EQ-1' })
        ]),
        'OrdenesTrabajo'
      );
      expect(result).toBeInstanceOf(Buffer);
    });
  });

});
