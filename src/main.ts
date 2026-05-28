import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { APP_DEFAULTS } from './common/constants/runtime.constants';
import { ResponseEnvelopeInterceptor } from './common/interceptors/response-envelope.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { setupSwagger } from './infrastructure/http/swagger/swagger.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(helmet());
  setupSwagger(app);

  const config = app.get(ConfigService);
  await app.listen(config.get<number>('app.port') ?? APP_DEFAULTS.PORT);
}
bootstrap();
