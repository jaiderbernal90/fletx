import { User } from '@/modules/users/entities/user.entity';

export interface ICompany {
  id: number;
  name: string;
  sector: string;
  departmentId: number;
  cityId: number;
  users: User[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
