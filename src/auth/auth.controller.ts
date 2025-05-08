import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { CreateAuthDto } from './dto/create-auth.dto';
import { registerDto } from './dto/register-auth.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../security/auth-guard';
import { LoginDto } from './dto/login-auth.dto';
import { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log(loginDto, '--contr');

    const { user, token, refreshToken } =
      await this.authService.login(loginDto);

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 3600 * 24 * 10,
    });
    res
      .status(HttpStatus.OK)
      .json({ status: 'Success', data: { user, token } });
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  getMyData(@Req() req: any) {
    return req.user;
  }
  @Post('register')
  async create(@Body() registerDto: registerDto) {
    try {
      const user = await this.authService.create(registerDto);
      user.password = '';
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
  @Get('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['jwt'];
    console.log(token);

    const data: any = await this.authService.refersh(token);
    console.log(data);

    res.status(HttpStatus.OK).json({
      status: 'Succes',
      data: { user: data.user, token: data.access },
    });
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['jwt'];
    res.clearCookie('jwt');
    res.send('Yaxshi');
  }
}
