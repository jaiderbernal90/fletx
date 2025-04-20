import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './db';
import { dataSourceFactory } from './connection';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
