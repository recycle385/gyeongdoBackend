import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [GameGateway],
})
export class GameModule {}
