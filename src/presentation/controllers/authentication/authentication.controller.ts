import { StatusCodes } from 'http-status-codes';
import {
  Authorized,
  Body,
  BodyParam,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
  Post,
  UseBefore
} from 'routing-controllers';

import { AuthenticationLoginRequest } from '@application/authentication/authentication-login.request';
import { AuthenticationLoginResponse } from '@application/authentication/authentication-login.response';
import { AuthenticationLoginUseCase } from '@application/authentication/authentication-login.usecase';
import { AuthenticationRefreshUseCase } from '@application/authentication/authentication-refresh.usecase';
import { AuthenticationRegisterRequest } from '@application/authentication/authentication-register.request';
import { AuthenticationRegisterUseCase } from '@application/authentication/authentication-register.usecase';
import { Token } from '@application/token/token';
import { Role } from '@domain/user/role';
import { User } from '@domain/user/user';
import { AuthenticationMiddleware } from '@presentation/middlewares/authentication.middleware';

@JsonController('/auth')
class AuthenticationController {
  private authenticationLoginUseCase: AuthenticationLoginUseCase;

  private authenticationRegisterUseCase: AuthenticationRegisterUseCase;

  private authenticationRefreshUseCase: AuthenticationRefreshUseCase;

  constructor(
    authenticationLoginUseCase: AuthenticationLoginUseCase,
    authenticationRegisterUseCase: AuthenticationRegisterUseCase,
    authenticationRefreshUseCase: AuthenticationRefreshUseCase
  ) {
    this.authenticationLoginUseCase = authenticationLoginUseCase;
    this.authenticationRegisterUseCase = authenticationRegisterUseCase;
    this.authenticationRefreshUseCase = authenticationRefreshUseCase;
  }

  // static PredefinedUsers = [
  //   {
  //     userId: '1',
  //     username: 'admin',
  //     email: 'admin@reservation.com',
  //     roles: ['Admin'],
  //     password: 'hilton',
  //   },
  //   {
  //     userId: '2',
  //     username: 'employee',
  //     email: 'employee@reservation.com',
  //     roles: ['Employee'],
  //     password: 'hilton',
  //   },
  //   {
  //     userId: '3',
  //     username: 'guest',
  //     email: 'guest@reservation.com',
  //     roles: ['Guest'],
  //     password: 'hilton',
  //   },
  //   {
  //     userId: '4',
  //     username: 'visitor',
  //     email: 'visitor@reservation.com',
  //     roles: ['Visitor'],
  //     password: 'hilton',
  //   }
  // ]
  @Post('/login')
  @HttpCode(StatusCodes.OK)
  async login(@Body({ validate: true }) request: AuthenticationLoginRequest): Promise<AuthenticationLoginResponse> {
    // const user = AuthenticationController.PredefinedUsers.find((u)=>u.username === username && u.password === password)
    return this.authenticationLoginUseCase.execute(request);
  }

  @Post('/employee')
  @UseBefore(AuthenticationMiddleware)
  @Authorized(['Admin'])
  @HttpCode(StatusCodes.OK)
  async createEmployee(@Body({ validate: true }) request: AuthenticationRegisterRequest): Promise<User> {
    request.roles = [Role.Employee];
    return this.authenticationRegisterUseCase.execute(request);
  }

  @Post('/guest')
  @HttpCode(StatusCodes.OK)
  async createGuest(@Body({ validate: true }) request: AuthenticationRegisterRequest): Promise<User> {
    request.roles = [Role.Guest];
    return this.authenticationRegisterUseCase.execute(request);
  }

  @Get('/refreshToken')
  @HttpCode(StatusCodes.OK)
  async refreshToken(@BodyParam('refreshToken') refreshToken: string): Promise<AuthenticationLoginResponse | null> {
    return this.authenticationRefreshUseCase.execute(refreshToken);
  }

  @Get('/currentUser')
  @UseBefore(AuthenticationMiddleware)
  @Authorized()
  // @Authorized(['Admin'])
  @HttpCode(StatusCodes.OK)
  currentUser(@CurrentUser() user?: Token): any {
    return user;
  }
}

export { AuthenticationController };
