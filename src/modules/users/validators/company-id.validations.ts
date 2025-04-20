import { Company } from '@/modules/companies/entities/company.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Repository } from 'typeorm';

@ValidatorConstraint({ name: 'companyExistValidator', async: true })
@Injectable()
export class CompanyExistValidator implements ValidatorConstraintInterface {
  constructor(@InjectRepository(Company) private readonly companyRepo: Repository<Company>) {}

  async validate(value: string) {
    if (!value) return false;

    try {
      const company = await this.companyRepo.findOne({ where: { id: +value } });
      return !!company;
    } catch (error) {
      console.error('Error validating company:', error);
      return false;
    }
  }

  defaultMessage() {
    return 'Company does not exist';
  }
}
