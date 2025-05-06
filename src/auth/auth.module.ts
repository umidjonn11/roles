import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthGuard } from 'src/security/auth-guard';
import { RolesGuard } from 'src/security/roles-guard';
@Module({
  imports:[forwardRef(() => UserModule),JwtModule.register({
    secret: process.env.JWT_SECRET ?? 'secret',
    global: true,
    signOptions: { expiresIn: '30m' },
  }),],
  controllers: [AuthController],
  providers: [AuthService,AuthGuard,RolesGuard],
  
})
export class AuthModule {}
