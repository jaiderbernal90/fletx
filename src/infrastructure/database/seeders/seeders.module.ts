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
import { Role } from '@/modules/users/entities/role.entity';
import { Permission } from '@/modules/users/entities/permission.entity';
import { UsersSeeder } from './modules/users.seeder';
import { RolesPermissionsSeeder } from './modules/roles-permissions.seeder';
import { RolesSeeder } from './modules/roles.seeder';
import { PermissionsSeeder } from './modules/permissions.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([User, Department, City, Company, Product, Role, Permission])],
  providers: [
    SeedersService,
    DepartmentsSeeder,
    PermissionsSeeder,
    CitiesSeeder,
    UsersSeeder,
    RolesPermissionsSeeder,
    RolesSeeder,
  ],
  exports: [SeedersService],
})
export class SeedersModule {}
