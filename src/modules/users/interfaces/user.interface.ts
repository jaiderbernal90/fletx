export interface ITokenPayload {
  id: number;
  email: string;
  name: string;
  role: IRole;
  permissions: string[];
  companyId: number;
}

export interface IRole {
  id: number;
  name: string;
  permissions: IPermission[];
}

export interface IPermission {
  id: number;
  name: string;
}
