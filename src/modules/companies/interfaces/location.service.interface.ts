import { City } from '../entities/city.entity';
import { Department } from '../entities/department.entity';

export const LOCATION_SERVICE_TOKEN = 'LOCATION_SERVICE_TOKEN';

export interface ILocationService {
  getDepartments(): Promise<Department[]>;
  getCitiesByDepartmentId(departmentId: number): Promise<City[]>;
}
