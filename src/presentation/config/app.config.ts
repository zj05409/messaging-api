import { sync as readPackageJsonSync } from 'read-pkg';

import { getEnvironmentNumber, getEnvironmentString } from '@infrastructure/shared/config/environment';

const AppInfo = {
  APP_VERSION: getEnvironmentString('APP_VERSION', readPackageJsonSync().version),
  APP_NAME: getEnvironmentString('APP_NAME', 'base-app'),
  APP_DESCRIPTION: getEnvironmentString('APP_DESCRIPTION', '🚀 To infinity and beyond!'),
  AUTHOR_NAME: getEnvironmentString('AUTHOR_NAME', 'Borja Paz Rodríguez'),
  AUTHOR_EMAIL: getEnvironmentString('AUTHOR_EMAIL', 'borjapazr@gmail.com'),
  AUTHOR_WEBSITE: getEnvironmentString('AUTHOR_WEBSITE', 'https://bpaz.dev')
};

const AppConfig = {
  PORT: getEnvironmentNumber('PORT', 3000),
  BASE_PATH: getEnvironmentString('BASE_PATH', '/api'),
  JWT_SECRET: getEnvironmentString('JWT_SECRET', 'jwtSecretPassphrase'),
  JWT_EXPIRATION: getEnvironmentNumber('JWT_EXPIRATION', 1),
  JWT_REFRESH_EXPIRATION: getEnvironmentNumber('JWT_REFRESH_EXPIRATION', 6)
};

export { AppConfig, AppInfo };
