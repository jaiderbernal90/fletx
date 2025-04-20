import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './services/seeders.service';
import { User } from '@/modules/users/entities/user.entity';
import { DepartmentsSeeder } from './modules/departments.seeder';
import { CitiesSeeder } from './modules/cities.seeder';
import { Department } from '@/modules/companies/entities/department.entity';
import { City } from '@/modules/companies/entities/city.entity';
import { Company } from '@/modules/companies/entities/company.entity';
import { Product } from '@/modules/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Department, City, Company, Product])],
  providers: [SeedersService, DepartmentsSeeder, CitiesSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
