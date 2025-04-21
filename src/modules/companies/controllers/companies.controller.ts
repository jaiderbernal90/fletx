import { Controller, Body, Param, Query, ParseIntPipe, Inject, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/shared/guards/auth/auth.guard';
import { PermissionsGuard } from '@/shared/guards/permissions/permissions.guard';
import { COMPANIES_SERVICE_TOKEN, ICompaniesService } from '../interfaces/companies.service.interface';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { CreateCompanyDecorator } from '../decorators/create.decorator';
import { FindAllCompanyDecorator, FindOneCompanyDecorator } from '../decorators/find.decorator';
import { PageOptionsDto } from '@/shared/dtos/pagination/page-options.dto';
import { UpdateCompanyDecorator } from '../decorators/update.decorator';
import { DeleteCompanyDecorator } from '../decorators/delete.decorator';
import { UpdateCompanyDto } from '../dto/update-company.dto';

@Controller('companies')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags('Companies')
export class CompaniesController {
  constructor(@Inject(COMPANIES_SERVICE_TOKEN) private readonly companiesSvc: ICompaniesService) {}

  @CreateCompanyDecorator()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesSvc.create(createCompanyDto);
  }

  @FindAllCompanyDecorator()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.companiesSvc.findAll(pageOptionsDto);
  }

  @FindOneCompanyDecorator()
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.companiesSvc.findOne({ id });
  }

  @UpdateCompanyDecorator()
  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesSvc.update(id, updateCompanyDto);
  }

  @DeleteCompanyDecorator()
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.companiesSvc.remove(id);
  }
}
