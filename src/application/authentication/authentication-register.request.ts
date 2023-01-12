// import 'reflect-metadata';

import { IsEmail, MaxLength, MinLength } from 'class-validator';

import { Role } from '@domain/user/role';

class AuthenticationRegisterRequest {
  @MinLength(2)
  @MaxLength(50)
  username: string;

  @MinLength(6)
  @MaxLength(50)
  password: string;

  @IsEmail()
  @MaxLength(50)
  email: string;

  @MinLength(2)
  @MaxLength(50)
  name: string;

  @MinLength(0)
  @MaxLength(200)
  avatar: string;

  roles: Role[];
}

export { AuthenticationRegisterRequest };
