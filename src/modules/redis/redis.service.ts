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
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connected successfully.');
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis connection error:', err);
    });
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis connection closed gracefully.');
    }
  }

  async set(key: string, value: any, ttl?: number) {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await this.client.set(key, stringValue, 'EX', ttl);
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

  async hGet(key: string, field: string) {
    const data = await this.client.hget(key, field);
    try {
      return data ? JSON.parse(data) : data;
    } catch {
      return data;
    }
  }

  async hGetAll(key: string) {
    return await this.client.hgetall(key);
  }

  async hIncrBy(key: string, field: string, increment: number) {
    return await this.client.hincrby(key, field, increment);
  }

  getClient(): Redis {
    return this.client;
  }
}
