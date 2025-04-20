import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { USERS_SERVICE_TOKEN } from './interfaces/users.service.interface';
import { CompanyExistValidator } from './validators/company-id.validations';
import { RoleExistValidator } from './validators/role-id.validations';
import { Company } from '../companies/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission, Company])],
  controllers: [UsersController],
  providers: [
    {
      provide: USERS_SERVICE_TOKEN,
      useClass: UsersService,
    },
    CompanyExistValidator,
    RoleExistValidator,
  ],
  exports: [
    {
      provide: USERS_SERVICE_TOKEN,
      useClass: UsersService,
    },
  ],
})
export class UsersModule {}
