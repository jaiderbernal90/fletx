import { CommandFactory } from 'nest-commander';
import { CommandsModule } from './infrastructure/commands/commands.module';

async function bootstrap() {
  console.log('Starting the application...');

  try {
    await CommandFactory.run(CommandsModule, {
      logger: ['error', 'warn', 'log', 'debug'],
    });
    console.log('Command executed successfully');
  } catch (error) {
    console.error('Error executing command:', error);
  }
}

bootstrap();
