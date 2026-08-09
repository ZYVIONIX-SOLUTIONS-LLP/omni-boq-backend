import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { TransformDecimalsInterceptor } from './common/interceptors/transform-decimals.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

const allowedOrigins = [
  'http://localhost:3000',
  'http://200.141.6.187:3000',
];

app.enableCors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
});
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalInterceptors(new TransformDecimalsInterceptor());

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
