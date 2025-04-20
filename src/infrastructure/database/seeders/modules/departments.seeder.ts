import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seeder } from '../interfaces/seeder.interface';
import { Department } from '@/modules/companies/entities/department.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DepartmentsSeeder implements Seeder {
  private readonly logger = new Logger(DepartmentsSeeder.name);
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
  ) {}

  async seed() {
    this.logger.log('Seeding Departments...');
    const departmentsCount = await this.departmentRepo.count();

    if (departmentsCount !== 0) {
      this.logger.warn('Departments already seeded');
      return;
    }

    const jsonPath = path.resolve(__dirname, '../../data/departments.json');
    const departmentsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    const deparments = departmentsData.map(department => {
      return {
        name: department.name,
        description: department.description,
        id: department.id,
      };
    });

    await this.departmentRepo.save(deparments);
    this.logger.log('Departments seeding completed!');
  }
}
