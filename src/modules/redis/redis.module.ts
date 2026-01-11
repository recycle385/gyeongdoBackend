import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // ConfigService 사용을 위해 명시
  providers: [RedisService],
  exports: [RedisService], // 다른 모듈에서 RedisService를 쓸 수 있게 내보냄
})
export class RedisModule {}
