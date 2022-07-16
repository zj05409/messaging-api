import { IUserDao } from '@/persistence/user/user.dao';
import { AuthenticationLoginRequest } from '@application/authentication/authentication-login.request';
import { AuthenticationLoginResponse } from '@application/authentication/authentication-login.response';
import { BaseUseCase } from '@application/shared/base.usecase';
import { tokenProvider } from '@application/token';
import { UnauthorizedError } from '@infrastructure/errors';

class AuthenticationLoginUseCase
  implements BaseUseCase<AuthenticationLoginRequest, Promise<AuthenticationLoginResponse>>
{
  private userDao: IUserDao;

  constructor(userDao: IUserDao) {
    this.userDao = userDao;
  }

  async execute(request: AuthenticationLoginRequest): Promise<AuthenticationLoginResponse> {
    const user = await this.userDao.getUser(request.username);
    if (!user || user.password !== request.password) {
      throw new UnauthorizedError();
    }
    return new AuthenticationLoginResponse(
      user.username,
      user.username,
      user.email,
      user.roles,
      tokenProvider.createAccessToken(user.username, user.username, user.email, user.roles).token,
      tokenProvider.createRefreshToken(user.username, user.username, user.email).token
    );
  }
}

export { AuthenticationLoginUseCase };
