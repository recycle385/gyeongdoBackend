import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { RedisModule } from '../redis/redis.module'; // RedisModule 임포트

@Module({
  imports: [RedisModule], // GameGateway에서 RedisService를 주입받을 수 있게 함
  providers: [GameGateway],
})
export class GameModule {}
