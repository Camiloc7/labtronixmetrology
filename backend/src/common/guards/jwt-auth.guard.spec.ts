import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { JwtAuthGuard } from './jwt-auth.guard';

const mockJwtService = { verifyAsync: jest.fn() };
const mockConfigService = { get: jest.fn((_k: string, def?: unknown) => def) };
const mockFindOne = jest.fn();
const mockDataSource = {
  getRepository: jest.fn(() => ({ findOne: mockFindOne })),
};

function makeContext(cookies: Record<string, string>): {
  ctx: ExecutionContext;
  req: { cookies: Record<string, string>; user?: unknown };
} {
  const req: { cookies: Record<string, string>; user?: unknown } = { cookies };
  const ctx = {
    switchToHttp: () => ({ getRequest: () => req }),
  } as unknown as ExecutionContext;
  return { ctx, req };
}

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfigService.get.mockImplementation(
      (_k: string, def?: unknown) => def,
    );
    guard = new JwtAuthGuard(
      mockJwtService as unknown as JwtService,
      mockConfigService as unknown as ConfigService,
      mockDataSource as unknown as DataSource,
    );
  });

  it('rechaza si no hay cookie jwt', async () => {
    const { ctx } = makeContext({});
    await expect(guard.canActivate(ctx)).rejects.toThrow(
      new UnauthorizedException('No hay sesión activa'),
    );
  });

  it('rechaza si el token es inválido', async () => {
    mockJwtService.verifyAsync.mockRejectedValue(new Error('bad token'));
    const { ctx } = makeContext({ jwt: 'tok' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(
      new UnauthorizedException('Sesión inválida o expirada'),
    );
  });

  it('permite el acceso con usuario activo y adjunta el payload', async () => {
    mockJwtService.verifyAsync.mockResolvedValue({
      sub: 'u-1',
      email: 'a@b.com',
      role: 'ADMIN',
    });
    mockFindOne.mockResolvedValue({ id: 'u-1', isActive: true });
    const { ctx, req } = makeContext({ jwt: 'tok' });
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(req.user).toEqual({ sub: 'u-1', email: 'a@b.com', role: 'ADMIN' });
  });

  it('rechaza si el usuario fue desactivado', async () => {
    mockJwtService.verifyAsync.mockResolvedValue({ sub: 'u-1' });
    mockFindOne.mockResolvedValue({ id: 'u-1', isActive: false });
    const { ctx } = makeContext({ jwt: 'tok' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(
      new UnauthorizedException('Usuario inactivo o sin acceso'),
    );
  });

  it('rechaza si el usuario ya no existe', async () => {
    mockJwtService.verifyAsync.mockResolvedValue({ sub: 'u-x' });
    mockFindOne.mockResolvedValue(null);
    const { ctx } = makeContext({ jwt: 'tok' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(
      new UnauthorizedException('Usuario inactivo o sin acceso'),
    );
  });
});
