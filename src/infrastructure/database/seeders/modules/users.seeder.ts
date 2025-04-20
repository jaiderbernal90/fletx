import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seeder } from '../interfaces/seeder.interface';
import { User } from '@/modules/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import appConfig from '@/infrastructure/config/app.config';
import { generateHash } from '@/shared/utils/handleBcrypt';
import { Role } from '@/modules/users/entities/role.entity';

@Injectable()
export class UsersSeeder implements Seeder {
  private readonly logger = new Logger(UsersSeeder.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    private readonly configSvc: ConfigService,
  ) {}

  async seed() {
    this.logger.log('Seeding users...');
    const usersCount = await this.userRepo.count();

    if (usersCount !== 0) {
      this.logger.warn('Users already seeded');
      return;
    }

    const superAdminRole = await this.roleRepo.findOne({ where: { name: 'Super administrador' } });

    const users = [
      {
        name: 'Admin',
        lastName: 'Admin',
        email: 'admin@admin.com',
        position: 'Administrador',
        salary: 0,
        phone: '+571234567890',
        password: await generateHash(this.configSvc.get<string>(appConfig().app.passwordAdmin)),
        role: {
          id: superAdminRole.id,
        },
      },
    ];

    await this.userRepo.save(users);
    this.logger.log('Users seeding completed!');
  }
}
