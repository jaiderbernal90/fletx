import { Command, CommandRunner } from 'nest-commander';
import { Injectable, Logger } from '@nestjs/common';
import { SeedersService } from '../database/seeders/services/seeders.service';

@Injectable()
@Command({ name: 'seed', description: 'Seed the database with initial data' })
export class SeedCommand extends CommandRunner {
  private readonly logger = new Logger(SeedCommand.name);
  constructor(private readonly seedersService: SeedersService) {
    super();
  }

  async run(): Promise<void> {
    this.logger.log('Database seeding...');

    await this.seedersService.seed();

    this.logger.log('Database seeding completed.');
  }
}
