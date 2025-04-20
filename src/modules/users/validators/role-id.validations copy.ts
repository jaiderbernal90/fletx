import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@ValidatorConstraint({ name: 'roleExistValidator', async: true })
@Injectable()
export class RoleExistValidator implements ValidatorConstraintInterface {
  constructor(@InjectRepository(Role) private readonly roleRepo: Repository<Role>) {}

  async validate(value: string) {
    if (!value) return false;

    try {
      const role = await this.roleRepo.findOne({ where: { id: +value } });
      return !!role;
    } catch (error) {
      console.error('Error validating role:', error);
      return false;
    }
  }

  defaultMessage() {
    return 'Role does not exist';
  }
}
