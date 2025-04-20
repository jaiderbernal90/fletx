import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompaniesService } from './services/companies.service';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permissions } from '@/shared/enum/permissions.enum';
import { PageOptionsDto } from '@/shared/dtos/pagination/page-options.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @RequirePermissions(Permissions.viewCompany)
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.companiesService.findAll(pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.companiesService.findOne({ id });
  }

  @Patch(':id')
  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.companiesService.remove(id);
  }
}
