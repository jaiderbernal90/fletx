import { PageOptionsDto } from '@/shared/dtos/pagination/page-options.dto';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { PageDto } from '@/shared/dtos/pagination/page.dto';
import { Company } from '../entities/company.entity';
import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';
import { UpdateCompanyDto } from '../dto/update-company.dto';

export const COMPANIES_SERVICE_TOKEN = 'COMPANIES_SERVICE_TOKEN';

export interface ICompaniesService {
  create(createCompanyDto: CreateCompanyDto): Promise<{ message: string; data: Company }>;
  findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Company>>;
  findOne(
    whereConditions: FindOptionsWhere<Company> | FindOptionsWhere<Company>[],
    options?: { relations?: FindOptionsRelations<Company>; select?: FindOptionsSelect<Company> },
  ): Promise<Company>;
  update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<Company>;
  remove(id: number): Promise<Company>;
}
