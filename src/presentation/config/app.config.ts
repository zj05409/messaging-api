import { sync as readPackageJsonSync } from 'read-pkg';

import { getEnvironmentNumber, getEnvironmentString } from '@infrastructure/shared/config/environment';

const AppInfo = {
  APP_VERSION: getEnvironmentString('APP_VERSION', readPackageJsonSync().version),
  APP_NAME: getEnvironmentString('APP_NAME', 'base-app'),
  APP_DESCRIPTION: getEnvironmentString('APP_DESCRIPTION', 'A project finished in 6 days'),
  AUTHOR_NAME: getEnvironmentString('AUTHOR_NAME', 'Jacob Chang'),
  AUTHOR_EMAIL: getEnvironmentString('AUTHOR_EMAIL', 'zj05409@gmail.com'),
  AUTHOR_WEBSITE: getEnvironmentString('AUTHOR_WEBSITE', 'https://rillow.top/')
};

const AppConfig = {
  PORT: getEnvironmentNumber('PORT', 3000),
  BASE_PATH: getEnvironmentString('BASE_PATH', '/api')
};

export { AppConfig, AppInfo };
