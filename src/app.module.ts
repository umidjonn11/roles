import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';

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

  }), AuthModule],
})
export class AppModule {}
