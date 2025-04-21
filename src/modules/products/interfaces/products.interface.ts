import { ICompany } from '@/modules/companies/interfaces/companies.interface';

export interface IProducts {
  id: number;
  name: string;
  price: number;
  company: ICompany;
}
