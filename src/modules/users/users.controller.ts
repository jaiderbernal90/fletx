import { Controller, Body, Param, ParseIntPipe, Inject, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUsersService, USERS_SERVICE_TOKEN } from './interfaces/users.service.interface';
import { PageOptionsDto } from '@/shared/dtos/pagination/page-options.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/shared/guards/auth/auth.guard';
import { CreateUserDecorator } from './decorators/create.decorator';
import { FindAllUserDecorator, FindOneUserDecorator } from './decorators/find.decorator';
import { UpdateUserDecorator } from './decorators/update.decorator';
import { DeleteUserDecorator } from './decorators/delete.decorator';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(@Inject(USERS_SERVICE_TOKEN) private readonly usersService: IUsersService) {}

  @CreateUserDecorator()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @FindAllUserDecorator()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.usersService.findAll(pageOptionsDto);
  }

  @FindOneUserDecorator()
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.findOne({ id });
  }

  @UpdateUserDecorator()
  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @DeleteUserDecorator()
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.remove(id);
  }
}
