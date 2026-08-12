import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Socket, Server } from 'socket.io';
import { WorkOrderStatus } from './entities/work-order-item.entity';

interface JwtPayload {
  sub: string;
  role: string;
}

@WebSocketGateway({
  namespace: '/work-orders',
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class WorkOrdersGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket): Promise<void> {
    const token = client.handshake.headers.cookie
      ?.split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith('jwt='))
      ?.slice(4);

    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const user = await this.jwtService.verifyAsync<JwtPayload>(token);
      if (!user.sub) {
        client.disconnect(true);
        return;
      }
      client.data.user = user;
      client.join('authenticated-work-orders');
    } catch {
      client.disconnect(true);
    }
  }

  emitWorkOrderCreated(workOrderId: string): void {
    this.server.to('authenticated-work-orders').emit('work-order.created', {
      workOrderId,
    });
  }

  emitItemStatusChanged(
    workOrderId: string,
    itemId: string,
    previousStatus: WorkOrderStatus,
    status: WorkOrderStatus,
  ): void {
    this.server
      .to('authenticated-work-orders')
      .emit('work-order-item.status-changed', {
        workOrderId,
        itemId,
        previousStatus,
        status,
      });
  }
}
