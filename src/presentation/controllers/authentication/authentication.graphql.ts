// import { gql } from 'apollo-server-express';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import gql from 'graphql-tag';

import { AuthenticationLoginRequest } from '@application/authentication/authentication-login.request';
import { AuthenticationRegisterRequest } from '@application/authentication/authentication-register.request';
import { Token } from '@application/token';
import { LOGGER } from '@domain/shared';
import { Role } from '@domain/user/role';
import { UnauthorizedError } from '@infrastructure/errors';
import { DiContainer } from '@infrastructure/shared/di/di-container';
import { AuthenticationController } from '@presentation/controllers/authentication/authentication.controller';

const userFragment = `
      username: String!
      email: String!
      roles: [Role!]!
 `;
const typeDefinitions = gql`
  enum Role {
    Admin
    Employee
    Guest
    Visitor
    User
  }
  input LoginInput {
    username: String!
    password: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    email: String!
  }

  type User {
    _id: String!
    _rev: String!
    ${userFragment}
  }

  type LoginResult {
    ${userFragment}
    accessToken: String!
    refreshToken: String!
  }

  type TokenInfo {
    type: String!
    token: String!
    expiration: Int!
    ${userFragment}
  }

  extend type Mutation {
    login(
      input: LoginInput!
    ): LoginResult!
    createGuest(
      input: RegisterInput!
    ): User!
    createEmployee(
      input: RegisterInput!
    ): User!
    refreshToken(
      input: String!
    ): LoginResult!
  }
  extend type Query {
    currentUserInfo: TokenInfo!
  }
`;

const controller = () => {
  const authenticationController: AuthenticationController = DiContainer.diContainer.resolve(
    'authenticationController'
  ) as AuthenticationController;
  return authenticationController;
};

const resolvers = {
  // Date: dateScalar,
  Query: {
    currentUserInfo: async (_root: any, _arguments: any, context: { currentUser: Token }) => {
      return context.currentUser;
    }
  },
  Mutation: {
    login: async (_: any, arguments_: { input: any }) => {
      const authenticationController = controller();
      try {
        const loginRequestParsed = plainToClass(AuthenticationLoginRequest, arguments_.input);
        await validateOrReject(loginRequestParsed);
        return await authenticationController.login(loginRequestParsed);
      } finally {
        LOGGER.info('Login:' + JSON.stringify(arguments_.input));
      }
    },
    createGuest: async (_: any, arguments_: { input: any }) => {
      const authenticationController = controller();
      try {
        const registerRequestParsed = plainToClass(AuthenticationRegisterRequest, arguments_.input);
        await validateOrReject(registerRequestParsed);
        return await authenticationController.createGuest(registerRequestParsed);
      } finally {
        LOGGER.info('CreateGuest:' + JSON.stringify(arguments_.input));
      }
    },
    createEmployee: async (_: any, arguments_: { input: any }, context: { currentUser: Token }) => {
      if (!context.currentUser || !context.currentUser.roles?.includes(Role.Admin)) {
        throw new UnauthorizedError();
      }
      const authenticationController = controller();
      try {
        const registerRequestParsed: AuthenticationRegisterRequest = plainToClass(
          AuthenticationRegisterRequest,
          arguments_.input
        );
        await validateOrReject(registerRequestParsed);
        return await authenticationController.createEmployee(registerRequestParsed);
      } finally {
        LOGGER.info('CreateEmployee:' + JSON.stringify(arguments_.input));
      }
    },
    refreshToken: async (_: any, arguments_: { input: string }) => {
      const authenticationController = controller();
      try {
        return await authenticationController.refreshToken(arguments_.input);
      } finally {
        LOGGER.info('RefreshToken:' + JSON.stringify(arguments_.input));
      }
    }
  }
};

export { resolvers, typeDefinitions };
