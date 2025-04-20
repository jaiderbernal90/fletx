export interface ITokenPayload {
  id: number;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  companyId: number;
}
