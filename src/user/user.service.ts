import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Any } from 'telegraf/typings/core/helpers/util';
import { compare } from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepo: Repository<UserRepository>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    return await this.userRepo.save(user);
  }

  async findAll() {
    return await this.userRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  async validateUser(username: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      select: ['email', 'id', 'name', 'password', 'username', 'role'],
    });
    try {
      if (!user) throw new NotFoundException('User topilmadi');
      console.log(user);

      const checking = await compare(password, user.password);
      if (!checking) throw new BadRequestException('Parol xato');
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
  async updateUser(id: string, updateData: Any) {
    const user = await this.userRepo.findOneBy({ id });
    if (user) {
      Object.assign(user, updateData);
      await this.userRepo.save(user);
      return user;
    }
    throw new NotFoundException('User topilmadi');
  }
  async refresh(token: string) {
    const user = await this.userRepo.findOne({
      where: { refreshToken: token },
    });
    return user;
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
