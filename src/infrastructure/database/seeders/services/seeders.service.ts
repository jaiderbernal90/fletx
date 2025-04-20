import { Injectable, Logger } from '@nestjs/common';
import { DepartmentsSeeder } from '../modules/departments.seeder';
import { CitiesSeeder } from '../modules/cities.seeder';

@Injectable()
export class SeedersService {
  private readonly logger = new Logger(SeedersService.name);
  constructor(
    private readonly departmentsSeeder: DepartmentsSeeder,
    private readonly citiesSeeder: CitiesSeeder,
  ) {}

  async seed() {
    this.logger.log('Seeding database...');

    await this.departmentsSeeder.seed();
    await this.citiesSeeder.seed();
    // await this.rolesSeeder.seed();
    // await this.rolesPermissionsSeeder.seed();

    this.logger.log('Seeding completed!');
  }
}
