import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seeder } from '../interfaces/seeder.interface';
import { Permission } from '@/modules/users/entities/permission.entity';

@Injectable()
export class PermissionsSeeder implements Seeder {
  private readonly logger = new Logger(PermissionsSeeder.name);

  constructor(@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>) {}

  async seed() {
    this.logger.log('Seeding permissions...');
    const permissionsCount = await this.permissionRepository.count();

    if (permissionsCount !== 0) {
      this.logger.warn('Permissions already seeded');
      return;
    }

    const permissions = [
      {
        name: 'create:user',
      },
      {
        name: 'view:user',
      },
      {
        name: 'update:user',
      },
      {
        name: 'delete:user',
      },
      {
        name: 'create:product',
      },
      {
        name: 'view:product',
      },
      {
        name: 'update:product',
      },
      {
        name: 'delete:product',
      },
      {
        name: 'create:company',
      },
      {
        name: 'view:company',
      },
      {
        name: 'update:company',
      },
      {
        name: 'delete:company',
      },
    ];

    await this.permissionRepository.save(permissions);
    this.logger.log('Permissions seeding completed!');
  }
}
