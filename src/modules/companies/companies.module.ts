import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { City } from './entities/city.entity';
import { Department } from './entities/department.entity';
import { CompaniesService } from './services/companies.service';
import { CityExistValidator } from './validators/city-id.validations';
import { DepartmentExistValidator } from './validators/department-id.validations';
import { COMPANIES_SERVICE_TOKEN } from './interfaces/companies.service.interface';
import { LOCATION_SERVICE_TOKEN } from './interfaces/location.service.interface';
import { LocationService } from './services/location.service';
import { CompaniesController } from './controllers/companies.controller';
import { LocationController } from './controllers/location.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Company, City, Department])],
  controllers: [CompaniesController, LocationController],
  providers: [
    {
      provide: COMPANIES_SERVICE_TOKEN,
      useClass: CompaniesService,
    },
    {
      provide: LOCATION_SERVICE_TOKEN,
      useClass: LocationService,
    },
    CityExistValidator,
    DepartmentExistValidator,
  ],
})
export class CompaniesModule {}
