import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { City } from './entities/city.entity';
import { Department } from './entities/department.entity';
import { CompaniesService } from './services/companies.service';
import { CityExistValidator } from './validators/city-id.validations';
import { DepartmentExistValidator } from './validators/department-id.validations';
import { COMPANIES_SERVICE_TOKEN } from './interfaces/companies.service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Company, City, Department])],
  controllers: [CompaniesController],
  providers: [
    {
      provide: COMPANIES_SERVICE_TOKEN,
      useClass: CompaniesService,
    },
    CityExistValidator,
    DepartmentExistValidator,
  ],
})
export class CompaniesModule {}
