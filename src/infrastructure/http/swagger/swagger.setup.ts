import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  SWAGGER_CUSTOM_CSS,
  SWAGGER_UI_FAVICON,
  SWAGGER_UI_SITE_TITLE,
} from './swagger.theme';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Mini Bank API')
    .setDescription(
      [
        'A clean banking API with a stable response envelope.',
        'Authentication flows are documented with request examples, error cases, and payload examples.',
      ].join(' '),
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: SWAGGER_UI_SITE_TITLE,
    customfavIcon: SWAGGER_UI_FAVICON,
    customCss: SWAGGER_CUSTOM_CSS,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      displayRequestDuration: true,
      persistAuthorization: true,
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 2,
      displayOperationId: false,
      showCommonExtensions: true,
      showExtensions: true,
    },
  });
}
