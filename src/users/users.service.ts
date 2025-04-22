import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Prisma } from '@prisma/client';
import { th } from '@faker-js/faker';

@Injectable()
export class UsersService {
  usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async create(user: Prisma.UserUncheckedCreateInput) {
    return this.usersRepository.createUser({
      ...user,
    });
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async updateById(id: string, user: Prisma.UserUncheckedUpdateInput) {
    return this.usersRepository.updateById(id, user);
  }

  async findAll() {
    return this.usersRepository.findAll();
  }
 }
