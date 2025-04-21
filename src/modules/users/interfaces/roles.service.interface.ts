import { Role } from '../entities/role.entity';

export const ROLES_SERVICE_TOKEN = 'ROLES_SERVICE_TOKEN';

export interface IRolesService {
  findAll(): Promise<Role[]>;
}
