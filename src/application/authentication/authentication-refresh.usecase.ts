import { IUserDao } from '@/persistence/user/user.dao';
import { BaseUseCase } from '@application/shared/base.usecase';
import { tokenProvider } from '@application/token';
import { UnauthorizedError } from '@infrastructure/errors';

import { AuthenticationLoginResponse } from './authentication-login.response';

class AuthenticationRefreshUseCase implements BaseUseCase<string, Promise<AuthenticationLoginResponse>> {
  private userDao: IUserDao;

  constructor(userDao: IUserDao) {
    this.userDao = userDao;
  }

  async execute(refreshToken: string): Promise<AuthenticationLoginResponse> {
    const isRefreshTokenValid = tokenProvider.validateRefreshToken(refreshToken);

    if (isRefreshTokenValid) {
      const parsedToken = tokenProvider.parseToken(refreshToken);
      if (!parsedToken) {
        throw new UnauthorizedError();
      }
      const user = await this.userDao.getUser(parsedToken?.username);
      if (!user) {
        throw new UnauthorizedError();
      }
      return new AuthenticationLoginResponse(
        user.username,
        user.username,
        user.email,
        user.roles,
        tokenProvider.createAccessToken(user.username, user.username, user.email, user.roles).token,
        refreshToken
      );
    }
    throw new UnauthorizedError();
  }
}

export { AuthenticationRefreshUseCase };
