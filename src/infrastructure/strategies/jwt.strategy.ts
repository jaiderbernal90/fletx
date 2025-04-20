import { ITokenPayload } from '@/modules/users/interfaces/user.interface';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IUsersService, USERS_SERVICE_TOKEN } from '@/modules/users/interfaces/users.service.interface';
import { ConfigService } from '@nestjs/config';
import appConfig from '../config/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USERS_SERVICE_TOKEN) private readonly userSvc: IUsersService,
    private readonly configSvc: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configSvc.get<string>(appConfig().jwt.secret),
    });
  }

  async validate(payload: ITokenPayload) {
    const user = await this.userSvc.findOne({ id: payload.id }, { relations: { role: { permissions: true } } });
    return user;
  }
}
