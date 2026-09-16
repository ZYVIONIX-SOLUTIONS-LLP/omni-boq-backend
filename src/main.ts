import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { TransformDecimalsInterceptor } from './common/interceptors/transform-decimals.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Increase payload limit for large Excel imports
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const allowedOrigins = [
    'http://localhost:3000',
    'http://200.141.6.187:3000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      console.log('Request Origin:', origin);

      // Allow requests without an Origin (Postman, mobile apps, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error(`Blocked by CORS: ${origin}`);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: false,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalInterceptors(new TransformDecimalsInterceptor());

  await app.listen(process.env.PORT || 3001);

  console.log(`🚀 Server running on: http://localhost:${process.env.PORT || 3001}`);
}

bootstrap();