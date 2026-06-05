import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { Role } from '../../common/enums/role.enum';

interface JwtPayload {
  sub: number;
  email: string;
  role: Role;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/orders',
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    const token = this.extractToken(client);

    if (token) {
      try {
        const payload = this.jwtService.verify<JwtPayload>(token, {
          secret: this.configService.getOrThrow<string>('jwt.accessSecret'),
        });

        client.data.user = {
          id: payload.sub,
          email: payload.email,
          role: payload.role,
        };

        if (payload.role === Role.EMPLOYEE || payload.role === Role.ADMIN) {
          client.join('kitchen');
        }
      } catch {
        // Allow anonymous connections for order tracking
      }
    }
  }

  handleDisconnect(_client: Socket) {
    // No cleanup required
  }

  @SubscribeMessage('order:join')
  joinOrderRoom(client: Socket, payload: { orderId: number }) {
    if (payload?.orderId) {
      client.join(`order:${payload.orderId}`);
    }

    return { joined: payload?.orderId ? `order:${payload.orderId}` : null };
  }

  emitOrderCreated(order: unknown) {
    this.server.to('kitchen').emit('order:created', order);
    this.server.emit('order:created', order);
  }

  emitOrderStatusChanged(orderId: number, status: OrderStatus, order: unknown) {
    this.server
      .to(`order:${orderId}`)
      .emit('order:statusChanged', { orderId, status, order });
    this.server.to('kitchen').emit('order:statusChanged', { orderId, status, order });
  }

  private extractToken(client: Socket): string | null {
    const authHeader = client.handshake.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }

    const token = client.handshake.auth?.token;
    return typeof token === 'string' ? token : null;
  }
}
