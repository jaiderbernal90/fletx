import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService implements IUsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    this.logger.log('UsersService initialized');
  }

  async create(createUserDto: CreateUserDto): Promise<{ message: string; data?: User }> {
    try {
      this.logger.log(`Creating user with email: ${createUserDto.email}`);

      const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });

      if (existingUser) {
        this.logger.warn(`User with email ${createUserDto.email} already exists`);
        return { message: 'User already exists' };
      }

      this.logger.debug('Hashing password');
      const passwordHash = await bcrypt.hash(createUserDto.password, 10);

      const { roleId, companyId } = createUserDto;
      this.logger.debug(`Using roleId: ${roleId}, companyId: ${companyId}`);

      const user = this.userRepository.create({
        ...createUserDto,
        password: passwordHash,
        role: roleId ? { id: roleId } : undefined,
        company: companyId ? { id: companyId } : undefined,
      });

      const result = await this.userRepository.save(user, { reload: true });
      this.logger.log(`User created successfully with ID: ${result.id}`);

      return { message: 'User created successfully', data: result as User };
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(`Failed to create user: ${error.message}`);
    }
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    try {
      this.logger.log(`Finding all users with pagination: page ${pageOptionsDto.page}, size ${pageOptionsDto.take}`);

      const { skip, take } = pageOptionsDto;

      const defaultOrder: FindOptionsOrder<User> = {
        createdAt: pageOptionsDto.order,
      } as any;

      this.logger.debug(`Executing findAndCount with skip: ${skip}, take: ${take}`);
      const [items, itemCount] = await this.userRepository.findAndCount({
        relations: {
          role: true,
          company: true,
        },
        order: defaultOrder,
        skip,
        take,
      });

      this.logger.log(`Found ${items.length} users (total: ${itemCount})`);

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
    } catch (error) {
      this.logger.error(`Error finding users: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to fetch users: ${error.message}`);
    }
  }

  async findOne(
    whereConditions: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    options?: { relations?: FindOptionsRelations<User>; select?: FindOptionsSelect<User> },
  ): Promise<User> {
    try {
      this.logger.log(`Finding user with conditions: ${JSON.stringify(whereConditions)}`);

      const user = await this.userRepository.findOne({
        where: whereConditions,
        relations: options?.relations,
        select: options?.select,
      });

      if (user) {
        this.logger.log(`User found with ID: ${user.id}`);
      } else {
        this.logger.warn('No user found for the specified conditions');
      }

      return user;
    } catch (error) {
      this.logger.error(`Error finding user: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to fetch user: ${error.message}`);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      this.logger.log(`Updating user with ID: ${id}`);

      const existingUser = await this.findByIdAndValidate(id);
      this.logger.debug(`Found user to update: ${existingUser.email}`);

      const updateData: any = { ...updateUserDto };

      if (updateUserDto.password) {
        this.logger.debug('Hashing new password');
        updateData.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      if (updateUserDto.roleId) {
        this.logger.debug(`Updating roleId to: ${updateUserDto.roleId}`);
        updateData.role = { id: updateUserDto.roleId };
        delete updateData.roleId;
      }

      if (updateUserDto.companyId) {
        this.logger.debug(`Updating companyId to: ${updateUserDto.companyId}`);
        updateData.company = { id: updateUserDto.companyId };
        delete updateData.companyId;
      }

      await this.userRepository.update(id, updateData);
      this.logger.log('User updated successfully');

      const updatedUser = await this.findOne({ id }, { relations: { role: true, company: true } });

      return updatedUser as User;
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(`Failed to update user: ${error.message}`);
    }
  }

  async remove(id: number): Promise<User> {
    try {
      this.logger.log(`Removing user with ID: ${id}`);

      const user = await this.findByIdAndValidate(id);
      this.logger.debug(`Found user to remove: ${user.email}`);

      await this.userRepository.delete(id);
      this.logger.log('User removed successfully');

      return user as User;
    } catch (error) {
      this.logger.error(`Error removing user: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(`Failed to remove user: ${error.message}`);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      this.logger.log(`Finding user by email: ${email}`);

      const user = await this.findOne({ email });

      if (!user) {
        this.logger.warn(`User with email ${email} not found`);
        return null;
      }

      return user;
    } catch (error) {
      this.logger.error(`Error finding user by email: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to find user by email: ${error.message}`);
    }
  }

  private async findByIdAndValidate(id: number): Promise<User> {
    this.logger.debug(`Validating user existence with ID: ${id}`);

    const user = await this.findOne({ id }, { relations: { role: true, company: true } });

    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}
