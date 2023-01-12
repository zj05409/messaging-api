import { IUserDao } from '@/persistence/user/user.dao';
import { AuthenticationRegisterRequest } from '@application/authentication/authentication-register.request';
import { BaseUseCase } from '@application/shared/base.usecase';
import { User } from '@domain/user/user';

class AuthenticationRegisterUseCase implements BaseUseCase<AuthenticationRegisterRequest, Promise<User>> {
  private userDao: IUserDao;

  constructor(userDao: IUserDao) {
    this.userDao = userDao;
  }

  async execute(request: AuthenticationRegisterRequest): Promise<User> {
    const user = await this.userDao.createOrReplaceUser(
      new User(request.username, request.password, request.email, request.roles, request.name, request.avatar)
    );
    user.password = '';
    return user;
  }
}

export { AuthenticationRegisterUseCase };
