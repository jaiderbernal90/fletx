import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { IRolesService } from '../interfaces/roles.service.interface';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService implements IRolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(@InjectRepository(Role) private readonly userRepository: Repository<Role>) {
    this.logger.log('UsersService initialized');
  }

  async findAll(): Promise<Role[]> {
    try {
      this.logger.log('Finding all roles');
      const items = await this.userRepository.find({});

      this.logger.log(`Found ${items.length} roles`);

      return items;
    } catch (error) {
      this.logger.error(`Error finding roles: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to fetch roles: ${error.message}`);
    }
  }
}
