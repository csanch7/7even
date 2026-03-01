import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const token = client.handshake.auth?.token as string | undefined;
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(token, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET')
      });
      client.data.userId = payload.sub;
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('chat:send')
  async handleSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { matchId: string; text: string }
  ) {
    const message = await this.chatService.sendMessage(body.matchId, client.data.userId, {
      body: body.text
    });

    this.server.to(body.matchId).emit('chat:new', message);
    this.server.to(body.matchId).emit('chat:delivered', {
      messageId: message.id,
      deliveredAt: new Date().toISOString()
    });
    return message;
  }

  @SubscribeMessage('chat:join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { matchId: string }
  ) {
    client.join(body.matchId);
    return { ok: true };
  }

  @SubscribeMessage('chat:read')
  async handleRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { matchId: string; messageId: string }
  ) {
    const message = await this.chatService.markRead(
      body.matchId,
      client.data.userId,
      body.messageId
    );
    this.server.to(body.matchId).emit('chat:read', {
      messageId: message.id,
      readAt: new Date().toISOString()
    });
    return message;
  }

  @SubscribeMessage('chat:typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { matchId: string; typing: boolean }
  ) {
    client.to(body.matchId).emit('chat:typing', {
      userId: client.data.userId,
      typing: body.typing
    });
  }
}
