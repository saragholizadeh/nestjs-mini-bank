import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ResponseEnvelopeInterceptor } from './common/interceptors/response-envelope.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { setupSwagger } from './infrastructure/http/swagger/swagger.setup';
import { EnvironmentConfigService } from './configs/environment-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(EnvironmentConfigService);

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());
  app.useGlobalFilters(
    new HttpExceptionFilter(config.app.nodeEnv !== 'production'),
  );
  app.use(helmet());
  setupSwagger(app);

  await app.listen(config.app.port);
}
bootstrap();
