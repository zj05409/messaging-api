import { Role } from '@domain/user/role';

class AuthenticationLoginResponse {
  constructor(
    readonly userId: string,
    readonly username: string,
    readonly email: string,
    readonly roles: Role[],
    readonly accessToken: string,
    readonly refreshToken: string
  ) {}
}

export { AuthenticationLoginResponse };
