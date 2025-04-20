import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { City } from './entities/city.entity';
import { Department } from './entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, City, Department])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
