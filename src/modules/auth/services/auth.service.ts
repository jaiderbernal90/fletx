import { HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IAuthService } from '../interfaces/auth.service.interface';
import { LoginDto } from '../dto/login.dto';
import { compareHash } from '@/shared/utils/handleBcrypt';
import { JwtService } from '@nestjs/jwt';
import { IResponseToken } from '@/shared/interfaces/api.response.interface';
import { IUsersService, USERS_SERVICE_TOKEN } from '@/modules/users/interfaces/users.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtSvc: JwtService,
    @Inject(USERS_SERVICE_TOKEN) private readonly userSvc: IUsersService,
  ) {}

  public async login(dataLogin: LoginDto): Promise<IResponseToken> {
    const { email, password } = dataLogin;

    console.log('dataLogin', dataLogin);

    const findUser = await this.userSvc.findOne(
      { email },
      { relations: { role: { permissions: true } }, select: { id: true, name: true, email: true, password: true } },
    );
    if (!findUser) throw new NotFoundException('User not found');

    const { id, password: passwordHash, ...userData } = findUser;
    console.log('passwordHash', passwordHash);

    const checkPassword = await compareHash(password, passwordHash);
    if (!checkPassword) throw new HttpException('Invalid credentials', 403);

    const payload = { id, ...userData };
    console.log('payload', payload);
    const token = this.jwtSvc.sign(payload);

    return { token };
  }
}
