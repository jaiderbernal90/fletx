import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seeder } from '../interfaces/seeder.interface';
import { City } from '@/modules/companies/entities/city.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CitiesSeeder implements Seeder {
  private readonly logger = new Logger(CitiesSeeder.name);
  constructor(
    @InjectRepository(City)
    private readonly departmentRepo: Repository<City>,
  ) {}

  async seed() {
    this.logger.log('Seeding Cities...');
    const departmentsCount = await this.departmentRepo.count();

    if (departmentsCount !== 0) {
      this.logger.warn('Cities already seeded');
      return;
    }

    const jsonPath = path.resolve(__dirname, '../../data/cities.json');
    const citiesData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    const cities = citiesData.map(city => {
      return {
        name: city.name,
        department: { id: city.departmentId },
      };
    });

    await this.departmentRepo.save(cities);
    this.logger.log('Cities types seeding completed!');
  }
}
