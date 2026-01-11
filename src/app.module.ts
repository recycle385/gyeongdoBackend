import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import configuration from './common/configs/configuration';
import { validate } from './common/configs/env.validation'; // ⭐️ 검증 로직 import
import { RedisModule } from './modules/redis/redis.module';
import { GameModule } from './modules/game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate, // ⭐️ [핵심] 이걸 넣어야 서버 켜질 때 환경변수를 검사합니다!
    }),

    // ⭐️ [보안] 레이트 리미터 추가 (1분에 100회 요청 제한)
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),

    RedisModule,
    GameModule,
  ],
  providers: [
    // ⭐️ [보안] 모든 API에 레이트 리미터 적용
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
