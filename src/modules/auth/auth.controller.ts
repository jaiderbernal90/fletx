import { Controller, Body, Inject } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AUTH_SERVICE_TOKEN, IAuthService } from './interfaces/auth.service.interface';
import { LoginDecorator } from './decorators/login.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE_TOKEN) private readonly authSvc: IAuthService) {}

  @LoginDecorator()
  async loginUser(@Body() body: LoginDto) {
    return await this.authSvc.login(body);
  }
}
