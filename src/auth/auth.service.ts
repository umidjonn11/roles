import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(loginData: LoginDto) {
    console.log(loginData);
    const user = await this.userService.validateUser(
      loginData.username,
      loginData.password,
    );
    const token = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
      username: user.username,
    });
    console.log(await this.jwtService.verifyAsync(token));

    const refreshToken = await this.jwtService.sign(
      {
        id: user.id,
        role: user.role,
        username: user.username,
      },
      { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '7d' },
    );
    await this.userService.updateUser(user.id, { refreshToken: refreshToken });

    return { user, token };
  }
}