import { IResponseToken } from '@/shared/interfaces/api.response.interface';
import { LoginDto } from '../dto/login.dto';

export const AUTH_SERVICE_TOKEN = 'AUTH_SERVICE_TOKEN';

export interface IAuthService {
  login(login: LoginDto): Promise<IResponseToken>;
}
