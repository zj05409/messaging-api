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

  @Post('/login')
  @HttpCode(StatusCodes.OK)
  async login(@Body({ validate: true }) request: AuthenticationLoginRequest): Promise<AuthenticationLoginResponse> {
    return this.authenticationLoginUseCase.execute(request);
  }

  @Post('/user')
  @HttpCode(StatusCodes.OK)
  async createUser(@Body({ validate: true }) request: AuthenticationRegisterRequest): Promise<User> {
    request.roles = [Role.User];
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
  @HttpCode(StatusCodes.OK)
  currentUser(@CurrentUser() user?: Token): any {
    return user;
  }
}

export { AuthenticationController };
