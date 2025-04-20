import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from '../auth/dto/create-user.dto';

@Injectable()
export class UsersService {
  usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async create(user: CreateUserDto) {
    return this.usersRepository.createUser(
      {
        ...user
      }
    )
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

}
