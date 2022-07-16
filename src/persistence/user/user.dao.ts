import { DatabaseScope, DocumentScope, ServerScope } from 'nano';

import { PersistenceError } from '@/persistence/shared/persistence.error';
import { LOGGER } from '@domain/shared';
import { Role } from '@domain/user/role';
import { User } from '@domain/user/user';

// import {classToPlain} from "class-transformer";

interface IUserDao {
  listUser(user_id: string | null): Promise<User[]>;
  getUser(id: string): Promise<User>;
  createOrReplaceUser(user: User): Promise<User>;
}
class UserDao implements IUserDao {
  private db: DatabaseScope;

  private repo: DocumentScope<User> | null;

  constructor(repo: ServerScope) {
    // let nano: ServerScope = <ServerScope>Nano('http://localhost:5984');
    this.db = repo.db;
    // this.db.destroy('user').then(()=>{
    //   this.db.create('user')
    // }).then(()=> {
    //   this.repo = this.db.use('user');
    // }).catch(()=>{
    //   this.repo = this.db.use('user');
    // })
  }

  async listUser(): Promise<User[]> {
    try {
      await this.initDb();
      this.repo = this.db.use('user');
      const result = await this.repo.find({
        selector: {}
      });
      // if (!response.ok) {
      //   throw new PersistenceError();
      // }
      // return User.fromJson(response);
      return result.docs;
    } catch (error) {
      LOGGER.error(error);
      throw new PersistenceError();
    } finally {
      this.repo = null;
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      await this.initDb();
      this.repo = this.db.use('user');
      // if (!response.ok) {
      //   throw new PersistenceError();
      // }
      // return User.fromJson(response);
      return await this.repo.get(id);
    } catch (error) {
      LOGGER.error(error);
      throw new PersistenceError();
    } finally {
      this.repo = null;
    }
  }

  async createOrReplaceUser(user: User): Promise<User> {
    try {
      await this.initDb();
      this.repo = this.db.use('user');
      const response = await this.repo.insert(user);
      if (!response.ok) {
        throw new PersistenceError();
      }
      user._id = response.id;
      user._rev = response.rev;
      return user;
    } catch (error) {
      LOGGER.error(error);
      throw new PersistenceError();
    } finally {
      this.repo = null;
    }
  }

  private async initDb() {
    if (!this.repo) {
      // this.repo = this.db.use('user');
      // if(this.repo) {
      //   return;
      // }
      try {
        const databaseList = await this.db.list();
        if (!databaseList.includes('user')) {
          await this.db.create('user');
          await this.db.use('user').insert(new User('admin', 'hilton', 'admin@reservation.com', [Role.Admin]));
          await this.db.use('user').insert(new User('employee', 'hilton', 'employee@reservation.com', [Role.Employee]));
          await this.db.use('user').insert(new User('guest', 'hilton', 'guest@reservation.com', [Role.Guest]));
        }
      } catch (error) {
        LOGGER.error(error);
      }
    }
  }
}

export { IUserDao, UserDao };
