import { io } from 'socket.io-client';

export type WorkOrderRealtimeEvent =
  | { type: 'created'; workOrderId: string }
  | {
      type: 'status-changed';
      workOrderId: string;
      itemId: string;
      previousStatus: string;
      status: string;
    };

function getSocketBaseUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';
  return new URL(apiUrl).origin;
}

export function subscribeToWorkOrderEvents(
  onEvent: (event: WorkOrderRealtimeEvent) => void,
): () => void {
  const socket = io(`${getSocketBaseUrl()}/work-orders`, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });

  socket.on('work-order.created', ({ workOrderId }) => {
    onEvent({ type: 'created', workOrderId });
  });
  socket.on('work-order-item.status-changed', (event) => {
    onEvent({ type: 'status-changed', ...event });
  });

  return () => socket.disconnect();
}
