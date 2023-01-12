// import 'reflect-metadata';

import { MaxLength, MinLength } from 'class-validator';

class AuthenticationLoginRequest {
  @MinLength(2)
  @MaxLength(50)
  username: string;

  @MinLength(5)
  @MaxLength(50)
  password: string;
}

export { AuthenticationLoginRequest };
