import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Seeder } from '../interfaces/seeder.interface';
import { Role } from '@/modules/users/entities/role.entity';
import { Permission } from '@/modules/users/entities/permission.entity';

@Injectable()
export class RolesPermissionsSeeder implements Seeder {
  private readonly logger = new Logger(RolesPermissionsSeeder.name);

  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
  ) {}

  async seed() {
    await this.superAdminRole();
    await this.adminRole();
    await this.generalRole();
    await this.operationsRole();
    this.logger.log('Roles permissions seeding completed!');
  }

  private async superAdminRole() {
    const superAdminRole = await this.roleRepository.findOne({ where: { name: 'Super administrador' } });

    if (!superAdminRole?.permissions?.length) {
      const permissionsSuperAdminRole = await this.permissionRepository.find({});

      await this.roleRepository.save({
        ...superAdminRole,
        permissions: permissionsSuperAdminRole.map(p => {
          return { ...p };
        }),
      });
    } else {
      this.logger.warn('Super Admin role permissions already seeded');
    }
  }

  private async adminRole() {
    const adminRole = await this.roleRepository.findOne({ where: { name: 'Administrador' } });

    if (!adminRole?.permissions?.length) {
      const permissionsAdminRole = await this.permissionRepository.find({
        where: [
          { name: Like('create:%') },
          { name: Like('view:%') },
          { name: Like('update:%') },
          { name: 'delete:product' },
          { name: 'delete:company' },
        ],
      });

      await this.roleRepository.save({
        ...adminRole,
        permissions: permissionsAdminRole.map(p => {
          return { ...p };
        }),
      });
    } else {
      this.logger.warn('Admin role permissions already seeded');
    }
  }

  private async generalRole() {
    const generalRole = await this.roleRepository.findOne({ where: { name: 'General' } });

    if (!generalRole?.permissions?.length) {
      const permissionsGeneralRole = await this.permissionRepository.find({
        where: [{ name: 'view:product' }, { name: 'view:company' }],
      });

      await this.roleRepository.save({
        ...generalRole,
        permissions: permissionsGeneralRole.map(p => {
          return { ...p };
        }),
      });
    } else {
      this.logger.warn('General role permissions already seeded');
    }
  }

  private async operationsRole() {
    const operationRole = await this.roleRepository.findOne({ where: { name: 'Operarios' } });

    if (!operationRole?.permissions?.length) {
      const permissionsOperationsRole = await this.permissionRepository.find({
        where: [{ name: Like('%product%') }, { name: 'view:company' }],
      });

      await this.roleRepository.save({
        ...operationRole,
        permissions: permissionsOperationsRole.map(p => {
          return { ...p };
        }),
      });
    } else {
      this.logger.warn('Operations role permissions already seeded');
    }
  }
}
