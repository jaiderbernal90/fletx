import { Controller, Body, Param, Query, ParseIntPipe, Inject, UseGuards } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PageOptionsDto } from '@/shared/dtos/pagination/page-options.dto';
import { COMPANIES_SERVICE_TOKEN, ICompaniesService } from './interfaces/companies.service.interface';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/shared/guards/auth/auth.guard';
import { PermissionsGuard } from '@/shared/guards/permissions/permissions.guard';
import { CreateCompanyDecorator } from './decorators/create.decorator';
import { DeleteCompanyDecorator } from './decorators/delete.decorator';
import { FindAllCompanyDecorator, FindOneCompanyDecorator } from './decorators/find.decorator';
import { UpdateCompanyDecorator } from './decorators/update.decorator';

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
