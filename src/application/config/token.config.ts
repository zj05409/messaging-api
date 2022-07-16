import { getEnvironmentNumber, getEnvironmentString } from '@infrastructure/shared/config/environment';

const TokenConfig = {
  JWT_SECRET: getEnvironmentString('JWT_SECRET', 'jwtSecretPassphrase'),
  JWT_EXPIRATION: getEnvironmentNumber('JWT_EXPIRATION', 1),
  JWT_REFRESH_EXPIRATION: getEnvironmentNumber('JWT_REFRESH_EXPIRATION', 6)
};

export { TokenConfig };
