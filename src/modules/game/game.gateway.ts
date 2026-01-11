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

  @SubscribeMessage('move') // 플러터에서 'move'로 데이터를 보내면 실행
  async handleMove(@MessageBody() data: any) {
    // 1. Redis에 위치 정보 저장
    await this.redisService.set(`player:${data.id}`, data);

    // 2. 다른 모든 유저에게 위치 전송 (실시간 중계)
    this.server.emit('updateLocation', data);
  }
}
