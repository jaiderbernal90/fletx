import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import appConfig from './infrastructure/config/app.config';
import { json } from 'express';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './shared/filter/http-exception/http-exception.filter';

const appEnv = appConfig().app;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(json({ limit: '60mb' }));
  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder().setVersion('1.0').setTitle('FLEXT API Documentation').setVersion('1.0').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());
  const origin = configService.get<string>(appEnv.cors_origin).split(',');
  app.enableCors({
    origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(
    helmet({
      hidePoweredBy: true,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      referrerPolicy: { policy: 'no-referrer' },
      frameguard: { action: 'deny' },
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
      dnsPrefetchControl: { allow: false },
      noSniff: true,
      xssFilter: true,
    }),
  );

  const PORT = configService.get<number>(appEnv.port);
  await app.listen(PORT, () => {
    Logger.log(`Server running on port ${PORT}`);
  });
}
bootstrap();
