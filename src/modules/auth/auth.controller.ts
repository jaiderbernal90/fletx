import { Controller, Body, Inject } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AUTH_SERVICE_TOKEN, IAuthService } from './interfaces/auth.service.interface';
import { LoginDecorator } from './decorators/login.decorator';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE_TOKEN) private readonly authSvc: IAuthService) {}

  @LoginDecorator()
  async loginUser(@Body() body: LoginDto) {
    return await this.authSvc.login(body);
  }
}
