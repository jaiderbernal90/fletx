import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Repository } from 'typeorm';
import { Department } from '../entities/department.entity';

@ValidatorConstraint({ name: 'departmentExistValidator', async: true })
@Injectable()
export class DepartmentExistValidator implements ValidatorConstraintInterface {
  constructor(@InjectRepository(Department) private readonly departmentRepo: Repository<Department>) {}

  async validate(value: number) {
    if (!value) return false;

    try {
      const department = await this.departmentRepo.findOne({ where: { id: value } });
      return !!department;
    } catch (error) {
      console.error('Error validating department:', error);
      return false;
    }
  }

  defaultMessage() {
    return 'Department does not exist';
  }
}
