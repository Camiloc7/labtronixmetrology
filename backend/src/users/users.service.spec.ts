import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

const mockConfigService = {
  get: jest.fn((key: string, def?: unknown) => def),
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
        { provide: ConfigService, useValue: mockConfigService },
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

  describe('update', () => {
    beforeEach(() => {
      mockUserRepo.findOne.mockResolvedValue({ id: 'u-1', name: 'Demo' });
    });

    it('revoca las sesiones cuando el password cambia', async () => {
      mockUserRepo.save.mockImplementation((e) => Promise.resolve(e));
      const result = await service.update('u-1', { password: 'Nuevo2026!' });
      expect(result).toBeDefined();
      expect(mockUserRepo.update).toHaveBeenCalledWith('u-1', {
        hashedRefreshToken: null,
        previousHashedRefreshToken: null,
      });
    });

    it('no revoca sesiones si el password no cambia', async () => {
      mockUserRepo.save.mockImplementation((e) => Promise.resolve(e));
      await service.update('u-1', { name: 'Demo 2' });
      expect(mockUserRepo.update).not.toHaveBeenCalled();
    });
  });

  describe('deactivate', () => {
    it('revoca las sesiones del usuario desactivado', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 'u-1', name: 'Demo' });
      mockUserRepo.save.mockImplementation((e) => Promise.resolve(e));
      const result = await service.deactivate('u-1');
      expect(result).toEqual({ message: 'Usuario desactivado correctamente' });
      expect(mockUserRepo.update).toHaveBeenCalledWith('u-1', {
        hashedRefreshToken: null,
        previousHashedRefreshToken: null,
      });
    });
  });

  describe('importFromExcel', () => {
    beforeEach(() => {
      mockExcelService.importFromExcel.mockResolvedValue([
        { Email: 'nuevo@labtronix.com', Nombre: 'Nuevo', Rol: 'COMERCIAL' },
      ]);
      mockUserRepo.findOne.mockResolvedValue(null);
    });

    it('rechaza crear usuarios nuevos si DEFAULT_IMPORT_PASSWORD no está configurado', async () => {
      mockConfigService.get.mockReturnValue(undefined);
      await expect(service.importFromExcel(Buffer.from(''))).rejects.toThrow(
        BadRequestException,
      );
      expect(mockUserRepo.create).not.toHaveBeenCalled();
      expect(mockUserRepo.save).not.toHaveBeenCalled();
    });

    it('crea usuarios nuevos con el password de env cuando está configurado', async () => {
      mockConfigService.get.mockReturnValue('TempPass2026!');
      mockUserRepo.create.mockImplementation((e) => ({ id: 'x', ...e }));
      mockUserRepo.save.mockImplementation((e) => Promise.resolve(e));

      const result = await service.importFromExcel(Buffer.from(''));

      expect(result.created).toBe(1);
      const created = mockUserRepo.create.mock.calls[0][0];
      expect(created.email).toBe('nuevo@labtronix.com');
      expect(created.passwordHash).toBeTruthy();
      expect(created.passwordHash).not.toContain('TempPass2026!');
    });
  });
});