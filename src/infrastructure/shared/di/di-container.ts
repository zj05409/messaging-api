import { asClass, asFunction, AwilixContainer, createContainer, InjectionMode } from 'awilix';
import { useContainer } from 'routing-controllers';

import { ChatDao } from '@/persistence/chat/chat.dao';
import { MessageDao } from '@/persistence/message/message.dao';
import { UserDao } from '@/persistence/user/user.dao';
import {
  AuthenticationLoginUseCase,
  AuthenticationRefreshUseCase,
  AuthenticationRegisterUseCase,
  UserGetUseCase
} from '@application/authentication';
import { ChatCreateUseCase, ChatGetUseCase, ChatListUseCase } from '@application/chat';
import { HealthCheckerUseCase } from '@application/health/health-checker.usecase';
import {
  MessageCreateUseCase,
  MessageDeleteUseCase,
  MessageGetUseCase,
  MessageListUseCase
} from '@application/message';
import { LOGGER } from '@domain/shared';
import { AuthenticationController } from '@presentation/controllers/authentication';
import { ChatController } from '@presentation/controllers/chat';
import { HealthController } from '@presentation/controllers/health/health.controller';
import {
  AuthenticationMiddleware,
  ErrorHandlerMiddleware,
  MorganMiddleware,
  NotFoundMiddleware
} from '@presentation/middlewares';

import { AwilixAdapter } from './awilix.adapter';

const camelCaseClassNameMapper = (className: string): string =>
  className.charAt(0).toLocaleLowerCase() + className.slice(1);

class DiContainer {
  static readonly diContainer: AwilixContainer = createContainer({
    injectionMode: InjectionMode.CLASSIC
  });

  static async initialize(): Promise<AwilixContainer> {
    try {
      // Core dependencies
      this.registerSingletonClass([
        AuthenticationMiddleware,
        ErrorHandlerMiddleware,
        MorganMiddleware,
        NotFoundMiddleware
      ]);

      this.registerSingletonClass([
        HealthCheckerUseCase,
        AuthenticationRegisterUseCase,
        AuthenticationLoginUseCase,
        AuthenticationRefreshUseCase,
        UserGetUseCase,
        ChatListUseCase,
        ChatGetUseCase,
        ChatCreateUseCase,
        MessageListUseCase,
        MessageGetUseCase,
        MessageCreateUseCase,
        MessageDeleteUseCase
      ]);

      // Controllers
      this.registerSingletonClass([HealthController, AuthenticationController, ChatController]);

      this.registerSingletonClass([UserDao]);
      this.registerSingletonClass([ChatDao]);
      this.registerSingletonClass([MessageDao]);

      useContainer(new AwilixAdapter(this.diContainer, camelCaseClassNameMapper));

      return this.diContainer;
    } catch (error) {
      LOGGER.error(error);
      process.exit(1);
    }
  }

  static registerSingletonClass = (dependencies: any[]): void => {
    const dependenciesMap = Object.assign(
      {},
      ...dependencies.map(dependency => ({
        [camelCaseClassNameMapper(dependency.name)]: asClass(dependency).singleton()
      }))
    );

    DiContainer.diContainer.register(dependenciesMap);
  };

  static registerSingletonClassWithCustomName = (dependencies: { name: string; class: any }[]): void => {
    const dependenciesMap = Object.assign(
      {},
      ...dependencies.map(dependency => ({
        [dependency.name]: asClass(dependency.class).singleton()
      }))
    );

    DiContainer.diContainer.register(dependenciesMap);
  };

  static registerSingletonFunctions = (dependencies: any[]): void => {
    const dependenciesMap = Object.assign(
      {},
      ...dependencies.map(dependency => ({
        [camelCaseClassNameMapper(dependency.name)]: asFunction(dependency.class).singleton()
      }))
    );

    DiContainer.diContainer.register(dependenciesMap);
  };
}

export { DiContainer };
