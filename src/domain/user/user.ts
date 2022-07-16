import { Role } from '@domain/user/role';

class User {
  _id: string;

  _rev: string;

  username: string;

  password: string;

  email: string;

  roles: Role[];

  constructor(username: string, password: string, email: string, roles: Role[]) {
    this._id = username;
    this.username = username;
    this.password = password;
    this.email = email;
    this.roles = roles;
  }
}

export { User };
