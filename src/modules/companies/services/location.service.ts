import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from '../entities/department.entity';
import { City } from '../entities/city.entity';
import { Repository } from 'typeorm';
import { ILocationService } from '../interfaces/location.service.interface';

@Injectable()
export class LocationService implements ILocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(
    @InjectRepository(Department) private readonly departmentRepository: Repository<Department>,
    @InjectRepository(City) private readonly cityRepository: Repository<City>,
  ) {
    this.logger.log('LocationService initialized');
  }

  async getDepartments(): Promise<Department[]> {
    try {
      this.logger.log('Getting departments');
      const departments = await this.departmentRepository.find();
      this.logger.log(`Found ${departments.length} departments`);
      return departments;
    } catch (error) {
      this.logger.error(`Error getting departments: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to get departments: ${error.message}`);
    }
  }

  async getCitiesByDepartmentId(departmentId: number): Promise<City[]> {
    try {
      this.logger.log(`Getting cities for department ID: ${departmentId}`);
      const cities = await this.cityRepository.find({ where: { department: { id: departmentId } } });
      this.logger.log(`Found ${cities.length} cities for department ID: ${departmentId}`);
      return cities;
    } catch (error) {
      this.logger.error(`Error getting cities for department ID ${departmentId}: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to get cities: ${error.message}`);
    }
  }
}
