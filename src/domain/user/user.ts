import { classToPlain } from 'class-transformer';

import { Role } from '@domain/user/role';

class User {
  _id: string;

  _rev: string;

  username: string;

  password: string;

  email: string;

  roles: Role[];

  name: string;

  avatar: string;

  constructor(username: string, password: string, email: string, roles: Role[], name: string, avatar: string) {
    this._id = username;
    this.username = username;
    this.password = password;
    this.email = email;
    this.roles = roles;
    this.name = name;
    this.avatar = avatar;
  }

  toJson() {
    return classToPlain(this);
  }
}

export { User };
