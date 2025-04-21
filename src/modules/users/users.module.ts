import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { USERS_SERVICE_TOKEN } from './interfaces/users.service.interface';
import { CompanyExistValidator } from './validators/company-id.validations';
import { RoleExistValidator } from './validators/role-id.validations';
import { Company } from '../companies/entities/company.entity';
import { ROLES_SERVICE_TOKEN } from './interfaces/roles.service.interface';
import { UsersService } from './services/users.service';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission, Company])],
  controllers: [UsersController, RolesController],
  providers: [
    {
      provide: USERS_SERVICE_TOKEN,
      useClass: UsersService,
    },
    {
      provide: ROLES_SERVICE_TOKEN,
      useClass: RolesService,
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
