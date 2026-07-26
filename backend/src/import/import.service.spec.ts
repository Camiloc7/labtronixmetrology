import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ImportService } from './import.service';
import { Client } from '../clients/entities/client.entity';
import { Quote } from '../quotes/entities/quote.entity';
import { ServiceTracking } from '../quotes/entities/service-tracking.entity';
import { EquipmentReception } from '../equipment/entities/equipment-reception.entity';

describe('ImportService', () => {
  let service: ImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportService,
        { provide: getRepositoryToken(Client), useValue: {} },
        { provide: getRepositoryToken(Quote), useValue: {} },
        { provide: getRepositoryToken(ServiceTracking), useValue: {} },
        { provide: getRepositoryToken(EquipmentReception), useValue: {} },
      ],
    }).compile();

    service = module.get<ImportService>(ImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
