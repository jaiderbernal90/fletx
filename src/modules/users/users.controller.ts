import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Inject,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUsersService, USERS_SERVICE_TOKEN } from './interfaces/users.service.interface';
import { PageOptionsDto } from '@/shared/dtos/pagination/page-options.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/shared/guards/auth/auth.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permissions } from '@/shared/enum/permissions.enum';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(@Inject(USERS_SERVICE_TOKEN) private readonly usersService: IUsersService) {}

  @Post()
  @RequirePermissions(Permissions.createUser)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @RequirePermissions(Permissions.viewUser)
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.usersService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @RequirePermissions(Permissions.viewUser)
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.findOne({ id });
  }

  @Patch(':id')
  @RequirePermissions(Permissions.updateUser)
  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @RequirePermissions(Permissions.deleteUser)
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.remove(id);
  }
}
