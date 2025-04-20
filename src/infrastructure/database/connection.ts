import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export const dataSourceFactory = async options => {
  const logger = new Logger('dataSourceFactory');

  try {
    const dataSource = await new DataSource(options).initialize();
    logger.log('Database connection established');
    return dataSource;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
