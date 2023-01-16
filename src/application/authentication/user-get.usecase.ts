import { IUserDao } from '@/persistence/user/user.dao';
import { BaseUseCase } from '@application/shared/base.usecase';

import { UserGetResponse } from './user-get.response';

class UserGetUseCase implements BaseUseCase<string[], Promise<UserGetResponse[]>> {
  private userDao: IUserDao;

  constructor(userDao: IUserDao) {
    this.userDao = userDao;
  }

  async execute(userIds: string[]): Promise<UserGetResponse[]> {
    const users = await this.userDao.listUser(userIds);
    return users.map(u => new UserGetResponse(u.username, u.name, u.email, u.avatar));
  }
}

export { UserGetUseCase };
