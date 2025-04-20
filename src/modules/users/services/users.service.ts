import { Injectable } from '@nestjs/common';
import { IUsersService } from '../interfaces/users.service.interface';
import { FindOptionsOrder, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PageMetaDto } from '@/shared/dtos/pagination/page-meta.dto';
import { Order } from '@/shared/constants/pagination';
import { PageOptionsDto } from '@/shared/dtos/pagination/page-options.dto';
import { PageDto } from '@/shared/dtos/pagination/page.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements IUsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<{ message: string; data?: User }> {
    try {
      const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });

      if (existingUser) {
        return { message: 'User already exists' };
      }

      const passwordHash = await bcrypt.hash(createUserDto.password, 10);

      const user = this.userRepository.create({
        ...createUserDto,
        password: passwordHash,
        role: { id: createUserDto.roleId },
        company: { id: createUserDto.companyId },
      });
      const result = await this.userRepository.save(user, { reload: true });
      return { message: 'User created successfully', data: result };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    const { skip, take } = pageOptionsDto;

    const defaultOrder: FindOptionsOrder<User> = {
      createdAt: pageOptionsDto.order,
    } as any;

    const [items, itemCount] = await this.userRepository.findAndCount({
      relations: {
        role: true,
        company: true,
      },
      order: defaultOrder,
      skip,
      take,
    });
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        pageCount: items.length,
        itemCount,
        page: pageOptionsDto.page || 1,
        take: pageOptionsDto.take,
        order: Order.DESC,
      },
      itemCount,
    });

    return new PageDto(items, pageMetaDto);
  }

  async findOne(
    whereConditions: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    options?: { relations?: FindOptionsRelations<User>; select?: FindOptionsSelect<User> },
  ): Promise<User> {
    return this.userRepository.findOne({
      where: whereConditions,
      relations: options?.relations,
      select: options?.select,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      await this.findByIdAndValidate(id);
      await this.userRepository.update(id, updateUserDto);
      return this.findOne({ id });
    } catch (error) {
      throw new Error(error);
    }
  }
  async remove(id: number): Promise<User> {
    try {
      await this.findByIdAndValidate(id);
      await this.userRepository.delete(id);
      return this.findOne({ id });
    } catch (error) {
      throw new Error(error);
    }
  }

  private async findByIdAndValidate(id: number): Promise<User> {
    const user = await this.findOne({ id });
    if (!user) throw new Error('User not found');
    return user;
  }
}
