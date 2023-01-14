/* eslint-disable security/detect-object-injection */
import { PersistenceError } from '@/persistence/shared/persistence.error';
import { LOGGER } from '@domain/shared';
import { Role } from '@domain/user/role';
import { User } from '@domain/user/user';
import { prisma, Role as PrismaRole } from '@infrastructure/shared/persistence/prisma/repo';

interface IUserDao {
  listUser(user_ids: string[] | null): Promise<User[]>;
  getUser(id: string): Promise<User | null>;
  createOrReplaceUser(user: User): Promise<User>;
}
class UserDao implements IUserDao {
  async listUser(usernames: string[]): Promise<User[]> {
    try {
      const result = await prisma.user.findMany({
        where: usernames.length > 0 ? { username: { in: usernames } } : {}
      });
      return result.map(
        u =>
          new User(
            u.username,
            u.password,
            u.email,
            u.roles.map(r => Role[PrismaRole[r]]),
            u.name,
            u.avatar,
            u.id
          )
      );
    } catch (error) {
      LOGGER.error(error);
      throw new PersistenceError();
    }
  }

  async getUser(username: string): Promise<User | null> {
    try {
      const result = await prisma.user.findFirst({ where: { username } });
      // const allResult = await prisma.user.findMany();
      // const count = await prisma.user.count();
      // console.log(JSON.stringify({ count, allResult }));
      if (!result) {
        return null;
      }
      return new User(
        result.username,
        result.password,
        result.email,
        result.roles.map(r => Role[PrismaRole[r]]),
        result.name,
        result.avatar,
        result.id
      );
    } catch (error) {
      LOGGER.error(error);
      throw new PersistenceError();
    }
  }

  async createOrReplaceUser(user: User): Promise<User> {
    try {
      const response = await prisma.user.create({ data: user });
      user.id = response.id;
      return user;
    } catch (error) {
      LOGGER.error(error);
      throw new PersistenceError();
    }
  }
}

export { IUserDao, UserDao };
