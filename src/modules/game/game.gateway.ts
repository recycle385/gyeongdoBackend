import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RedisService } from '../redis/redis.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly redisService: RedisService) {}

  @SubscribeMessage('move')
  async handleMove(@MessageBody() data: any) {
    await this.redisService.set(`player:${data.id}`, data);

    this.server.emit('updateLocation', data);
  }
}
