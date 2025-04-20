import { Module } from '@nestjs/common';
import { SeedCommand } from './seed.command';
import { SeedersModule } from '../database/seeders/seeders.module';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    SeedersModule,
  ],
  providers: [SeedCommand],
  exports: [SeedCommand],
})
export class CommandsModule {}
