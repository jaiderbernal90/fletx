import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PageDto } from '@/shared/dtos/pagination/page.dto';
import { PageOptionsDto } from '@/shared/dtos/pagination/page-options.dto';

export const USERS_SERVICE_TOKEN = 'USERS_SERVICE_TOKEN';

export interface IUsersService {
  create(createUserDto: CreateUserDto): Promise<{ message: string; data?: User }>;
  findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>>;
  findOne(
    whereConditions: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    options?: { relations?: FindOptionsRelations<User>; select?: FindOptionsSelect<User> },
  ): Promise<User>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
  remove(id: number): Promise<User>;
}
