import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
      password: this.configService.get<string>('redis.password'),
      // 재연결 전략 설정 (단단한 연결 유지를 위해 필수)
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    // 연결 이벤트 리스너 (디버깅 용이성 확보)
    this.client.on('connect', () => {
      this.logger.log('Redis connected successfully.');
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis connection error:', err);
    });
  }

  // 앱 종료 시 연결을 우아하게 끊어줌 (메모리 누수 방지)
  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis connection closed gracefully.');
    }
  }

  async set(key: string, value: any, ttl?: number) {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await this.client.set(key, stringValue, 'EX', ttl); // 만료 시간 지원 추가
    } else {
      await this.client.set(key, stringValue);
    }
  }

  async get(key: string) {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async hSet(key: string, field: string, value: any) {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
    await this.client.hset(key, field, stringValue);
  }

  // [추가] 해시 조회
  async hGet(key: string, field: string) {
    const data = await this.client.hget(key, field);
    try {
      return data ? JSON.parse(data) : data;
    } catch {
      return data;
    }
  }

  // [추가] 해시 전체 조회 (방의 모든 플레이어 조회용)
  async hGetAll(key: string) {
    return await this.client.hgetall(key);
  }

  // [추가] 숫자 증가 (검거 횟수 카운팅용)
  async hIncrBy(key: string, field: string, increment: number) {
    return await this.client.hincrby(key, field, increment);
  }

  // 필요한 경우 클라이언트 인스턴스에 접근할 수 있도록 getter 추가
  getClient(): Redis {
    return this.client;
  }
}
