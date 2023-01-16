import { plainToClass } from 'class-transformer';

import { Role } from '@domain/user/role';
import { User } from '@domain/user/user';

const userJson = {
  id: 'jacob1',
  username: 'jacob1',
  password: 'jacob1',
  email: 'jacob1@gradual.com',
  roles: [Role.Admin, Role.User],
  name: 'Jacob1',
  avatar: 'https://avatars.githubusercontent.com/u/1572996?v=4'
};
const userResultJson = {
  ...userJson
};
const user = new User(
  'jacob1',
  'jacob1',
  'jacob1@gradual.com',
  [Role.Admin, Role.User],
  'Jacob1',
  'https://avatars.githubusercontent.com/u/1572996?v=4'
);

describe('Testing User generation', () => {
  it('should return a valid User from json data', () => {
    return expect(plainToClass(User, userJson)).toEqual(user);
  });
});
describe('Testing User parsing', () => {
  it('should return valid json data from a User', () => {
    return expect(user.toJson()).toEqual(userResultJson);
  });
});
