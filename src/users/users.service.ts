import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const hashPassword = bcrypt.hashSync(createUserDto.password, 10);

    const createdUser = await (
      await this.userModel
        .create({
          email: createUserDto.email,
          password: hashPassword,
        })
        .catch((err) => {
          if (err.code === 11000) {
            throw new BadRequestException('Email already exists');
          }
          throw new BadRequestException(err.message);
        })
    ).save();

    if (!createdUser) {
      throw new BadRequestException('User not created');
    }

    return {
      message: 'User created successfully',
    };
  }

  async findByEmailForLogin(email: string) {
    const user = await this.userModel
      .findOne({ email })
      .exec()
      .catch((error) => {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
          throw new ForbiddenException('Not found user');
        } else {
          throw new ForbiddenException('Not found user');
        }
      });

    if (!user) return null;
    return user;
  }
}
