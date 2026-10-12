import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ExcelService } from '../common/excel/excel.service';

const mockUserRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
  findAndCount: jest.fn(),
};

const mockExcelService = {
  exportToExcel: jest.fn(),
  importFromExcel: jest.fn(),
};

describe('UsersService (persistencia de refresh tokens)', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: ExcelService, useValue: mockExcelService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('updateRefreshToken', () => {
    it('fija el hash actual y limpia el anterior', async () => {
      mockUserRepo.update.mockResolvedValue({ affected: 1 });
      await service.updateRefreshToken('u-1', 'abc123');
      expect(mockUserRepo.update).toHaveBeenCalledWith('u-1', {
        hashedRefreshToken: 'abc123',
        previousHashedRefreshToken: null,
      });
    });

    it('admite null para cerrar sesión', async () => {
      mockUserRepo.update.mockResolvedValue({ affected: 1 });
      await service.updateRefreshToken('u-1', null);
      expect(mockUserRepo.update).toHaveBeenCalledWith('u-1', {
        hashedRefreshToken: null,
        previousHashedRefreshToken: null,
      });
    });
  });

  describe('rotateRefreshToken', () => {
    it('desplaza el hash actual a previous y guarda el nuevo', async () => {
      mockUserRepo.update.mockResolvedValue({ affected: 1 });
      await service.rotateRefreshToken('u-1', 'hash-viejo', 'hash-nuevo');
      expect(mockUserRepo.update).toHaveBeenCalledWith('u-1', {
        previousHashedRefreshToken: 'hash-viejo',
        hashedRefreshToken: 'hash-nuevo',
      });
    });
  });

  describe('revokeRefreshTokens', () => {
    it('borra ambos hashes (revocación de la familia)', async () => {
      mockUserRepo.update.mockResolvedValue({ affected: 1 });
      await service.revokeRefreshTokens('u-1');
      expect(mockUserRepo.update).toHaveBeenCalledWith('u-1', {
        hashedRefreshToken: null,
        previousHashedRefreshToken: null,
      });
    });
  });

  describe('findOne', () => {
    it('lanza NotFoundException si el usuario no existe', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('nope')).rejects.toThrow(NotFoundException);
    });
  });
});