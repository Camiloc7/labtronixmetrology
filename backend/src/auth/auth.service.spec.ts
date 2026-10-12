import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

const sha256 = (t: string) =>
  crypto.createHash('sha256').update(t).digest('hex');

const mockConfigService = {
  get: jest.fn((key: string, def?: unknown) => {
    const map: Record<string, unknown> = {
      JWT_REFRESH_SECRET: 'test-refresh-secret',
      NODE_ENV: 'test',
    };
    return key in map ? map[key] : def;
  }),
};

const mockUsersService = {
  findByEmail: jest.fn(),
  findOne: jest.fn(),
  createGoogleUser: jest.fn(),
  update: jest.fn(),
  updateLoginAttempts: jest.fn(),
  updateRefreshToken: jest.fn(),
  rotateRefreshToken: jest.fn(),
  revokeRefreshTokens: jest.fn(),
};

const jwtService = new JwtService({
  secret: 'test-access-secret',
  signOptions: { expiresIn: '15m' },
});

describe('AuthService', () => {
  let service: AuthService;
  let passwordHash: string;

  beforeAll(async () => {
    passwordHash = await bcrypt.hash('clave-segura', 4);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  const makeUser = (overrides: Record<string, unknown> = {}) => ({
    id: 'u-1',
    name: 'Ana Admin',
    email: 'admin@labtronix.com',
    role: 'ADMIN',
    isActive: true,
    passwordHash,
    failedLoginAttempts: 0,
    lockedUntil: null,
    googleId: null,
    ...overrides,
  });

  describe('login', () => {
    it('devuelve access + refresh tokens y usuario saneado', async () => {
      mockUsersService.findByEmail.mockResolvedValue(makeUser());
      const result = await service.login({
        email: 'admin@labtronix.com',
        password: 'clave-segura',
      });

      expect(result.accessToken).toBeTruthy();
      expect(result.refreshToken).not.toBe(result.accessToken);
      expect(result.user).toEqual({
        id: 'u-1',
        name: 'Ana Admin',
        email: 'admin@labtronix.com',
        role: 'ADMIN',
      });
      // Persistencia: se guarda el hash SHA-256 (64 hex), nunca el token en claro.
      expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
        'u-1',
        sha256(result.refreshToken),
      );
    });

    it('rechaza credenciales inválidas y cuenta el intento', async () => {
      mockUsersService.findByEmail.mockResolvedValue(makeUser());
      await expect(
        service.login({
          email: 'admin@labtronix.com',
          password: 'incorrecta',
        }),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.updateLoginAttempts).toHaveBeenCalledWith(
        'u-1',
        1,
        null,
      );
    });

    it('bloquea la cuenta al 5º intento fallido durante 15 minutos', async () => {
      mockUsersService.findByEmail.mockResolvedValue(
        makeUser({ failedLoginAttempts: 4 }),
      );
      await expect(
        service.login({ email: 'a@b.c', password: 'incorrecta' }),
      ).rejects.toThrow(
        'Cuenta bloqueada temporalmente por múltiples intentos fallidos',
      );
      expect(mockUsersService.updateLoginAttempts).toHaveBeenCalledWith(
        'u-1',
        5,
        expect.any(Date),
      );
    });

    it('no permite login mientras la cuenta está bloqueada', async () => {
      mockUsersService.findByEmail.mockResolvedValue(
        makeUser({ lockedUntil: new Date(Date.now() + 60_000) }),
      );
      await expect(
        service.login({ email: 'a@b.c', password: 'clave-segura' }),
      ).rejects.toThrow(
        'Cuenta bloqueada temporalmente por múltiples intentos fallidos',
      );
    });

    it('reinicia los intentos al loguear correctamente tras fallos previos', async () => {
      mockUsersService.findByEmail.mockResolvedValue(
        makeUser({ failedLoginAttempts: 3 }),
      );
      await service.login({ email: 'a@b.c', password: 'clave-segura' });
      expect(mockUsersService.updateLoginAttempts).toHaveBeenCalledWith(
        'u-1',
        0,
        null,
      );
    });

    it('rechaza usuarios inactivos o inexistentes', async () => {
      mockUsersService.findByEmail.mockResolvedValue(
        makeUser({ isActive: false }),
      );
      await expect(
        service.login({ email: 'a@b.c', password: 'clave-segura' }),
      ).rejects.toThrow(UnauthorizedException);

      mockUsersService.findByEmail.mockResolvedValue(null);
      await expect(
        service.login({ email: 'nadie@x.com', password: 'x' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getTokens', () => {
    it('emite refresh tokens únicos incluso en el mismo segundo (jti)', async () => {
      const [a, b] = await Promise.all([
        service.getTokens('u-1', 'a@b.c', 'ADMIN', 'Ana'),
        service.getTokens('u-1', 'a@b.c', 'ADMIN', 'Ana'),
      ]);
      expect(a.refreshToken).not.toBe(b.refreshToken);
    });

    it('firma el refresh con JWT_REFRESH_SECRET y el access con el secreto por defecto', async () => {
      const { accessToken, refreshToken } = await service.getTokens(
        'u-1',
        'a@b.c',
        'ADMIN',
        'Ana',
      );
      const payload = await jwtService.verifyAsync<{ sub: string }>(
        refreshToken,
        { secret: 'test-refresh-secret' },
      );
      expect(payload.sub).toBe('u-1');
      await expect(
        jwtService.verifyAsync(refreshToken, { secret: 'test-access-secret' }),
      ).rejects.toThrow();
      expect(accessToken).toBeTruthy();
    });
  });

  describe('refreshTokens (rotación + persistencia)', () => {
    it('rechaza si el usuario no tiene refresh token almacenado', async () => {
      mockUsersService.findOne.mockResolvedValue(
        makeUser({ hashedRefreshToken: null, previousHashedRefreshToken: null }),
      );
      await expect(
        service.refreshTokens('u-1', 'un-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rota: guarda hash anterior y nuevo, y devuelve un token nuevo', async () => {
      const oldToken = 'refresh-viejo';
      mockUsersService.findOne.mockResolvedValue(
        makeUser({
          hashedRefreshToken: sha256(oldToken),
          previousHashedRefreshToken: null,
        }),
      );

      const result = await service.refreshTokens('u-1', oldToken);

      // Se emite un token distinto (nunca se reutiliza el recibido).
      expect(result.refreshToken).not.toBe(oldToken);
      // Persistencia de la rotación con hashes SHA-256.
      expect(mockUsersService.rotateRefreshToken).toHaveBeenCalledWith(
        'u-1',
        sha256(oldToken),
        sha256(result.refreshToken),
      );
      expect(mockUsersService.revokeRefreshTokens).not.toHaveBeenCalled();
    });

    it('permite encadenar: el token recién rotado vuelve a validarse y rota de nuevo', async () => {
      const tokenA = 'refresh-A';
      let user = makeUser({
        hashedRefreshToken: sha256(tokenA),
        previousHashedRefreshToken: null,
      });
      mockUsersService.findOne.mockImplementation(async () => user);

      const resB = await service.refreshTokens('u-1', tokenA);
      user = makeUser({
        hashedRefreshToken: sha256(resB.refreshToken),
        previousHashedRefreshToken: sha256(tokenA),
      });

      const resC = await service.refreshTokens('u-1', resB.refreshToken);
      expect(resC.refreshToken).not.toBe(resB.refreshToken);
      expect(mockUsersService.rotateRefreshToken).toHaveBeenCalledWith(
        'u-1',
        sha256(resB.refreshToken),
        sha256(resC.refreshToken),
      );
    });

    it('detecta reutilización de un token ya rotado: revoca toda la familia', async () => {
      const stolenToken = 'refresh-robado';
      mockUsersService.findOne.mockResolvedValue(
        makeUser({
          hashedRefreshToken: sha256('refresh-nuevo'),
          previousHashedRefreshToken: sha256(stolenToken),
        }),
      );

      await expect(
        service.refreshTokens('u-1', stolenToken),
      ).rejects.toThrow('Sesión revocada por reutilización del token de refresco');
      // Revocación persistente: se borran ambos hashes.
      expect(mockUsersService.revokeRefreshTokens).toHaveBeenCalledWith('u-1');
      expect(mockUsersService.rotateRefreshToken).not.toHaveBeenCalled();
    });

    it('rechaza un token desconocido sin tocar el almacén', async () => {
      mockUsersService.findOne.mockResolvedValue(
        makeUser({
          hashedRefreshToken: sha256('token-real'),
          previousHashedRefreshToken: null,
        }),
      );
      await expect(
        service.refreshTokens('u-1', 'un-token-ajeno'),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.rotateRefreshToken).not.toHaveBeenCalled();
      expect(mockUsersService.revokeRefreshTokens).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('borra el refresh token almacenado', async () => {
      await service.logout('u-1');
      expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
        'u-1',
        null,
      );
    });
  });

  describe('validateOAuthLogin', () => {
    it('crea el usuario automáticamente si no existe', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.createGoogleUser.mockResolvedValue(
        makeUser({ googleId: 'g-1' }),
      );
      const tokens = await service.validateOAuthLogin(
        'nuevo@x.com',
        'Nuevo',
        'g-1',
      );
      expect(tokens.refreshToken).toBeTruthy();
      expect(mockUsersService.createGoogleUser).toHaveBeenCalledWith(
        'nuevo@x.com',
        'Nuevo',
        'g-1',
      );
      expect(mockUsersService.updateRefreshToken).toHaveBeenCalled();
    });

    it('vincula el googleId a un usuario existente si no lo tenía', async () => {
      mockUsersService.findByEmail.mockResolvedValue(
        makeUser({ googleId: null }),
      );
      await service.validateOAuthLogin('a@b.c', 'Ana', 'g-99');
      expect(mockUsersService.update).toHaveBeenCalledWith('u-1', {
        googleId: 'g-99',
      });
    });

    it('rechaza usuarios inactivos', async () => {
      mockUsersService.findByEmail.mockResolvedValue(
        makeUser({ isActive: false, googleId: 'g-1' }),
      );
      await expect(
        service.validateOAuthLogin('a@b.c', 'Ana', 'g-1'),
      ).rejects.toThrow('Usuario inactivo');
    });
  });

  describe('getMe', () => {
    it('nunca expone hashes ni la contraseña', async () => {
      mockUsersService.findOne.mockResolvedValue(
        makeUser({
          passwordHash: 'x',
          hashedRefreshToken: sha256('a'),
          previousHashedRefreshToken: sha256('b'),
        }),
      );
      const me = await service.getMe('u-1');
      expect(me.id).toBe('u-1');
      expect(me).not.toHaveProperty('passwordHash');
      expect(me).not.toHaveProperty('hashedRefreshToken');
      expect(me).not.toHaveProperty('previousHashedRefreshToken');
    });
  });
});