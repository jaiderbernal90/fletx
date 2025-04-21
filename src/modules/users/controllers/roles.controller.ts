import { Controller, Inject, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/shared/guards/auth/auth.guard';
import { FindAllRolesDecorator } from '../decorators/find.decorator';
import { IRolesService, ROLES_SERVICE_TOKEN } from '../interfaces/roles.service.interface';

@Controller('roles')
@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(@Inject(ROLES_SERVICE_TOKEN) private readonly rolesSvc: IRolesService) {}

  @FindAllRolesDecorator()
  async findAll() {
    return await this.rolesSvc.findAll();
  }
}
