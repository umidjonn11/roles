import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(loginData: LoginDto) {
    const user = await this.userService.validateUser(
      loginData.username,
      loginData.password,
    );
    const token = await this.jwtService.signAsync({
      id: user?.id,
      role: user?.role,
      username: user?.username,
    });

    const refreshToken =  await this.jwtService.sign(
      {
        id: user.id,
        role: user.role,
        username: user.username,
      },
      { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '7d' },
    );
    
    await this.userService.updateUser(user.id, { refreshToken: refreshToken });

    return { user, token,refreshToken };
  }
  async create(data: any) {
    const user = await this.userService.create(data);
    return user;
  }
  async refersh(token: string) {
    const user = await this.userService.refresh(token);
    const access = await this.jwtService.signAsync({
      id: user?.id,
      role: user?.role,
      username: user?.username,
    });
    return { user, access };
  }
}
