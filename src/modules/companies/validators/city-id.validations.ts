import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';
import { CreateCompanyDto } from '../dto/create-company.dto';

@ValidatorConstraint({ name: 'cityExistValidator', async: true })
@Injectable()
export class CityExistValidator implements ValidatorConstraintInterface {
  constructor(@InjectRepository(City) private readonly cityRepo: Repository<City>) {}

  async validate(value: number, args: any) {
    if (!value) return false;

    const { departmentId } = args.object as CreateCompanyDto;

    try {
      const city = await this.cityRepo.findOne({ where: { id: value, department: { id: departmentId } } });
      return !!city;
    } catch (error) {
      console.error('Error validating city:', error);
      return false;
    }
  }

  defaultMessage() {
    return 'City does not exist';
  }
}
