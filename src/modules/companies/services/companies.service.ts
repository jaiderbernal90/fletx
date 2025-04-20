import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICompaniesService } from '../interfaces/companies.service.interface';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { Company } from '../entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { PageDto } from '@/shared/dtos/pagination/page.dto';
import { Order } from '@/shared/constants/pagination';
import { PageMetaDto } from '@/shared/dtos/pagination/page-meta.dto';
import { PageOptionsDto } from '@/shared/dtos/pagination/page-options.dto';

@Injectable()
export class CompaniesService implements ICompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(@InjectRepository(Company) private readonly companyRepository: Repository<Company>) {
    this.logger.log('CompaniesService initialized');
  }

  async create(createCompanyDto: CreateCompanyDto): Promise<{ message: string; data: Company }> {
    try {
      this.logger.log(`Creating company with name: ${createCompanyDto.name}`);

      const { cityId, departmentId } = createCompanyDto;
      this.logger.debug(`Using cityId: ${cityId}, departmentId: ${departmentId}`);

      const company = this.companyRepository.create({
        ...createCompanyDto,
        city: { id: cityId },
        department: { id: departmentId },
      });

      const result = await this.companyRepository.save(company, { reload: true });
      this.logger.log(`Company created successfully with ID: ${result.id}`);

      return { message: 'Company created successfully', data: result };
    } catch (error) {
      this.logger.error(`Error creating company: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(`Failed to create company: ${error.message}`);
    }
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Company>> {
    try {
      this.logger.log(
        `Finding all companies with pagination: page ${pageOptionsDto.page}, size ${pageOptionsDto.take}`,
      );

      const { skip, take } = pageOptionsDto;

      const defaultOrder: FindOptionsOrder<Company> = {
        createdAt: pageOptionsDto.order,
      } as any;

      this.logger.debug(`Executing findAndCount with skip: ${skip}, take: ${take}`);
      const [items, itemCount] = await this.companyRepository.findAndCount({
        relations: {
          city: true,
          department: true,
        },
        order: defaultOrder,
        skip,
        take,
      });

      this.logger.log(`Found ${items.length} companies (total: ${itemCount})`);

      const pageMetaDto = new PageMetaDto({
        pageOptionsDto: {
          pageCount: items.length,
          itemCount,
          page: pageOptionsDto.page || 1,
          take: pageOptionsDto.take,
          order: Order.DESC,
        },
        itemCount,
      });

      return new PageDto(items, pageMetaDto);
    } catch (error) {
      this.logger.error(`Error finding companies: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to fetch companies: ${error.message}`);
    }
  }

  async findOne(
    whereConditions: FindOptionsWhere<Company> | FindOptionsWhere<Company>[],
    options?: { relations?: FindOptionsRelations<Company>; select?: FindOptionsSelect<Company> },
  ): Promise<Company> {
    try {
      this.logger.log(`Finding company with conditions: ${JSON.stringify(whereConditions)}`);

      const company = await this.companyRepository.findOne({
        where: whereConditions,
        relations: options?.relations,
        select: options?.select,
      });

      if (company) {
        this.logger.log(`Company found with ID: ${company.id}`);
      } else {
        this.logger.warn('No company found for the specified conditions');
      }

      return company;
    } catch (error) {
      this.logger.error(`Error finding company: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to fetch company: ${error.message}`);
    }
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    try {
      this.logger.log(`Updating company with ID: ${id}`);

      const existingCompany = await this.findByIdAndValidate(id);
      this.logger.debug(`Found company to update: ${existingCompany.name}`);

      const updateData: any = { ...updateCompanyDto };

      if (updateCompanyDto.cityId) {
        this.logger.debug(`Updating cityId to: ${updateCompanyDto.cityId}`);
        updateData.city = { id: updateCompanyDto.cityId };
        delete updateData.cityId;
      }

      if (updateCompanyDto.departmentId) {
        this.logger.debug(`Updating departmentId to: ${updateCompanyDto.departmentId}`);
        updateData.department = { id: updateCompanyDto.departmentId };
        delete updateData.departmentId;
      }

      await this.companyRepository.update(id, updateData);
      this.logger.log('Company updated successfully');

      return this.findOne({ id }, { relations: { city: true, department: true } });
    } catch (error) {
      this.logger.error(`Error updating company: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(`Failed to update company: ${error.message}`);
    }
  }

  async remove(id: number): Promise<Company> {
    try {
      this.logger.log(`Removing company with ID: ${id}`);

      const company = await this.findByIdAndValidate(id);
      this.logger.debug(`Found company to remove: ${company.name}`);

      const companyToReturn = { ...company };

      await this.companyRepository.delete(id);
      this.logger.log('Company removed successfully');

      return companyToReturn as Company;
    } catch (error) {
      this.logger.error(`Error removing company: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(`Failed to remove company: ${error.message}`);
    }
  }

  private async findByIdAndValidate(id: number): Promise<Company> {
    this.logger.debug(`Validating company existence with ID: ${id}`);

    const company = await this.findOne({ id }, { relations: { city: true, department: true } });

    if (!company) {
      this.logger.warn(`Company with ID ${id} not found`);
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }
}
