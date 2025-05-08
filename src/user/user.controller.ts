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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../security/roles.decorator';
import { UserRole } from '../security/roles.enum';
import { AuthGuard } from 'src/security/auth-guard';
import { RolesGuard } from 'src/security/roles-guard';

@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.teacher)
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Req() req) {
    console.log(createUserDto, req.user);

    return await this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.user)
  findAll(@Req() req) {
    // console.log(req.user, '----userContr');
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}