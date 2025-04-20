import { Injectable, Logger } from '@nestjs/common';
import { DepartmentsSeeder } from '../modules/departments.seeder';
import { CitiesSeeder } from '../modules/cities.seeder';
import { PermissionsSeeder } from '../modules/permissions.seeder';
import { RolesSeeder } from '../modules/roles.seeder';
import { RolesPermissionsSeeder } from '../modules/roles-permissions.seeder';
import { UsersSeeder } from '../modules/users.seeder';

@Injectable()
export class SeedersService {
  private readonly logger = new Logger(SeedersService.name);
  constructor(
    private readonly departmentsSeeder: DepartmentsSeeder,
    private readonly citiesSeeder: CitiesSeeder,
    private readonly permissionsSeeder: PermissionsSeeder,
    private readonly rolesPermissionsSeeder: RolesPermissionsSeeder,
    private readonly rolesSeeder: RolesSeeder,
    private readonly usersSeeder: UsersSeeder,
  ) {}

  async seed() {
    this.logger.log('Seeding database...');

    await this.departmentsSeeder.seed();
    await this.citiesSeeder.seed();
    await this.permissionsSeeder.seed();
    await this.rolesPermissionsSeeder.seed();
    await this.rolesSeeder.seed();
    await this.usersSeeder.seed();

    this.logger.log('Seeding completed!');
  }
}
