import { Injectable } from '@nestjs/common';
import { EnvironmentConfig } from './environment-config.types';
import { createEnvironmentConfig } from './environment-config.factory';

@Injectable()
export class EnvironmentConfigService {
  private readonly config: EnvironmentConfig;

  constructor() {
    this.config = createEnvironmentConfig();
  }

  get app(): EnvironmentConfig['app'] {
    return this.config.app;
  }

  get database(): EnvironmentConfig['database'] {
    return this.config.database;
  }

  get jwt(): EnvironmentConfig['jwt'] {
    return this.config.jwt;
  }

  get redis(): EnvironmentConfig['redis'] {
    return this.config.redis;
  }
}
