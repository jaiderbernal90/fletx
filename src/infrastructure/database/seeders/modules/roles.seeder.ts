import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seeder } from '../interfaces/seeder.interface';
import { Role } from '@/modules/users/entities/role.entity';

@Injectable()
export class RolesSeeder implements Seeder {
  private readonly logger = new Logger();

  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}

  async seed() {
    this.logger.log('Seeding roles...');
    const permissionsCount = await this.roleRepository.count();

    if (permissionsCount !== 0) {
      this.logger.warn('Roles already seeded');
      return;
    }

    const roles = [
      {
        name: 'Super administrador',
      },
      {
        name: 'Administrador',
      },
      {
        name: 'General',
      },
      {
        name: 'Operarios',
      },
    ];

    await this.roleRepository.save(roles);
    this.logger.log('Roles seeding completed!');
  }
}
