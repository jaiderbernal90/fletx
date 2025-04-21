import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import databaseConfig from '../config/database.config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly dbProps = databaseConfig().database;
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const port = this.configService.get<number>(this.dbProps.port);
    const host = this.configService.get<string>(this.dbProps.host);
    const username = this.configService.get<string>(this.dbProps.username);
    const password = this.configService.get<string>(this.dbProps.password);
    const database = this.configService.get<string>(this.dbProps.database);
    return {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database,
      autoLoadEntities: true,
      synchronize: true,
      ssl: true,
    };
  }
}
