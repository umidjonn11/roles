import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { RedisModule } from './redis/redis.module';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forRoot({
    type:"postgres",
    username:"postgres",
    database:"auth",
    port:5432,
    host:"localhost",
    password:"umidjon06",
    synchronize:true,
    entities:[UserRepository],
    autoLoadEntities:true,
  }), AuthModule, CourseModule,RedisModule,
  ThrottlerModule.forRoot({
    throttlers: [
      {
        ttl: 20000,
        limit: 2,
      },
    ],
    storage: new ThrottlerStorageRedisService(
      new Redis({
        host: 'localhost', // Redis server host
        port: 6379, // Redis server port
      }),
    ),
  }),
],
providers: [
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },],
})
export class AppModule {}
