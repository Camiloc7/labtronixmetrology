import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QuotesService } from './quotes.service';
import { Quote, QuoteStatus } from './entities/quote.entity';
import { QuoteItem } from './entities/quote-item.entity';
import { QuoteHistory } from './entities/quote-history.entity';
import { ServiceTracking } from './entities/service-tracking.entity';
import { Client } from '../clients/entities/client.entity';
import { ExcelService } from '../common/excel/excel.service';
import { SettingsService } from '../settings/settings.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotFoundException } from '@nestjs/common';
import { ILike } from 'typeorm';
import { Response } from 'express';

const mockManager = {
  save: jest.fn((entity: any, data?: any) =>
    Promise.resolve(data !== undefined ? data : entity),
  ),
  create: jest.fn((entity: any, data: any) => ({ ...data })),
  delete: jest.fn(() => Promise.resolve()),
  transaction: jest.fn(async (cb: any) => cb(mockManager)),
};

const mockQuotesRepo = {
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  query: jest.fn(),
  manager: mockManager,
};

const mockItemsRepo = {
  delete: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

const mockClientsRepo = {
  findOne: jest.fn(),
};

const mockExcelService = {
  exportToExcel: jest.fn(),
  importFromExcel: jest.fn(),
};

const mockSettingsService = {
  getValue: jest.fn(),
};

const mockHistoryRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

const mockTrackingRepo = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

const mockNotificationsService = {};

describe('QuotesService', () => {
  let service: QuotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotesService,
        { provide: getRepositoryToken(Quote), useValue: mockQuotesRepo },
        { provide: getRepositoryToken(QuoteItem), useValue: mockItemsRepo },
        { provide: getRepositoryToken(QuoteHistory), useValue: mockHistoryRepo },
        { provide: getRepositoryToken(Client), useValue: mockClientsRepo },
        { provide: getRepositoryToken(ServiceTracking), useValue: mockTrackingRepo },
        { provide: ExcelService, useValue: mockExcelService },
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<QuotesService>(QuotesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated quotes without search', async () => {
      mockQuotesRepo.findAndCount.mockResolvedValue([[{ id: '1', quoteNumber: 'COT-2024-0001' }], 1]);

      const result = await service.findAll({ page: 2, limit: 5 });
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(5);
      expect(mockQuotesRepo.findAndCount).toHaveBeenCalledWith({
        where: {},
        order: { createdAt: 'DESC' },
        take: 5,
        skip: 5,
      });
    });

    it('should filter quotes when search parameter is provided', async () => {
      mockQuotesRepo.findAndCount.mockResolvedValue([[], 0]);
      await service.findAll({ page: 1, limit: 10, search: '0001' });

      expect(mockQuotesRepo.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
        where: [{ quoteNumber: ILike('%0001%') }],
      }));
    });
  });

  describe('findOne', () => {
    it('should return a quote by id with relations', async () => {
      mockQuotesRepo.findOne.mockResolvedValue({ id: '1', items: [] });
      const result = await service.findOne('1');
      expect(result.id).toBe('1');
      expect(mockQuotesRepo.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: { items: true, client: true, createdBy: true },
      });
    });

    it('should throw NotFoundException if quote is not found', async () => {
      mockQuotesRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    beforeEach(() => {
      mockQuotesRepo.query.mockResolvedValue([{ nextval: 101 }]);
      mockQuotesRepo.create.mockImplementation((entity) => ({
        id: 'new-id',
        ...entity,
      }));
      mockQuotesRepo.save.mockImplementation((entity) => Promise.resolve(entity));
    });

    it('should generate the next quote number from the sequence', async () => {
      const dto = {
        clientId: 'client-id',
        status: QuoteStatus.BORRADOR,
        items: [],
      };
      const result = await service.create(dto as any, 'user-id');

      expect(mockQuotesRepo.query).toHaveBeenCalledWith(
        `SELECT nextval('quote_number_seq')`,
      );
      expect(result.quoteNumber).toBe(`COT-${new Date().getFullYear()}-0101`);
    });

    it('should zero-pad the sequence value to 4 digits', async () => {
      mockQuotesRepo.query.mockResolvedValue([{ nextval: 1 }]);
      const result = await service.create(
        { clientId: 'client', items: [] } as any,
        'user',
      );
      expect(result.quoteNumber).toBe(`COT-${new Date().getFullYear()}-0001`);
    });

    it('should not truncate sequence values over 9999', async () => {
      mockQuotesRepo.query.mockResolvedValue([{ nextval: 12345 }]);
      const result = await service.create(
        { clientId: 'client', items: [] } as any,
        'user',
      );
      expect(result.quoteNumber).toBe(`COT-${new Date().getFullYear()}-12345`);
    });

    it('should calculate totalValue correctly based on items', async () => {
      const dto = {
        clientId: 'client-id',
        items: [
          { description: 'Item 1', quantity: 2, unitPrice: 100 },
          { description: 'Item 2', quantity: 1, unitPrice: 50 },
        ],
      };

      const result = await service.create(dto as any, 'user-id');
      expect(result.totalValue).toBe(250);
      expect(result.items).toHaveLength(2);
      expect(result.items[0].subtotal).toBe(200);
    });
  });

  describe('update', () => {
    const baseQuote = {
      id: '1',
      status: QuoteStatus.BORRADOR,
      totalValue: 1000,
      notes: undefined,
      items: [],
      client: { companyName: 'Test' },
      quoteNumber: 'COT-1',
    };

    it('should update basic fields without modifying items if items not provided', async () => {
      mockQuotesRepo.findOne.mockResolvedValue({ ...baseQuote });

      const result = await service.update('1', { notes: 'New notes' });

      expect(mockItemsRepo.delete).not.toHaveBeenCalled();
      expect(result.notes).toBe('New notes');
      expect(result.totalValue).toBe(1000); // Should remain unchanged
    });

    it('should delete old items and insert new ones if items are provided', async () => {
      mockQuotesRepo.findOne.mockResolvedValue({ ...baseQuote });

      const dto = {
        items: [{ description: 'New item', quantity: 1, unitPrice: 200 }],
      };

      const result = await service.update('1', dto as any);

      expect(mockManager.delete).toHaveBeenCalledWith(QuoteItem, {
        quoteId: '1',
      });
      expect(mockManager.save).toHaveBeenCalledWith(QuoteItem, expect.any(Array));
      expect(result.totalValue).toBe(200); // Should be recalculated
    });
  });

  describe('exportToExcel', () => {
    it('should fetch quotes and delegate to excel service', async () => {
      mockQuotesRepo.find.mockResolvedValue([
        { quoteNumber: 'COT-1', client: { nit: '123', companyName: 'Test' }, totalValue: 100 }
      ]);
      mockExcelService.exportToExcel.mockResolvedValue(Buffer.from('test'));

      const result = await service.exportToExcel();
      
      expect(mockQuotesRepo.find).toHaveBeenCalled();
      expect(mockExcelService.exportToExcel).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ Cotizacion: 'COT-1', NITCliente: '123' })
        ]),
        'Cotizaciones'
      );
      expect(result).toBeInstanceOf(Buffer);
    });
  });

  describe('importFromExcel', () => {
    it('should update existing quotes and create new ones', async () => {
      mockExcelService.importFromExcel.mockResolvedValue([
        { Cotizacion: 'COT-EXISTING', NITCliente: '123' },
        { Cotizacion: 'COT-NEW', Notas: 'Test new' }
      ]);
      
      mockClientsRepo.findOne.mockResolvedValue({ id: 'client-1' });
      
      // First is found, second is not
      mockQuotesRepo.findOne.mockImplementation(({ where: { quoteNumber } }) => {
        if (quoteNumber === 'COT-EXISTING') return Promise.resolve({ id: '1', quoteNumber });
        return Promise.resolve(null);
      });
      
      mockQuotesRepo.create.mockImplementation(e => e);
      mockQuotesRepo.save.mockResolvedValue({});
      mockTrackingRepo.findOne.mockResolvedValue(null);
      mockTrackingRepo.create.mockImplementation((data) => ({ ...data }));
      mockTrackingRepo.save.mockResolvedValue({});

      const result = await service.importFromExcel(Buffer.from(''), 'user1');
      
      expect(result.total).toBe(2);
      expect(result.updated).toBe(1);
      expect(result.created).toBe(1);
      expect(mockQuotesRepo.save).toHaveBeenCalledTimes(2);
    });
  });

});
