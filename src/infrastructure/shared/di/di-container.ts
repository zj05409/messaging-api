import { asClass, asFunction, AwilixContainer, createContainer, InjectionMode } from 'awilix';
import { useContainer } from 'routing-controllers';

import { ReservationDao } from '@/persistence/reservation/reservation.dao';
import { UserDao } from '@/persistence/user/user.dao';
import {
  AuthenticationLoginUseCase,
  AuthenticationRefreshUseCase,
  AuthenticationRegisterUseCase
} from '@application/authentication';
import { HealthCheckerUseCase } from '@application/health/health-checker.usecase';
import {
  ReservationCreateUseCase,
  ReservationGetUseCase,
  ReservationListUseCase,
  ReservationUpdateStatusUseCase,
  ReservationUpdateUseCase
} from '@application/reservation';
import { LOGGER } from '@domain/shared';
import { Repo } from '@infrastructure/shared/persistence/couch/repo';
import { AuthenticationController } from '@presentation/controllers/authentication';
import { HealthController } from '@presentation/controllers/health/health.controller';
import { ReservationController } from '@presentation/controllers/reservation/reservation.controller';
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

      // Use cases
      // this.registerSingletonClassWithCustomName([
      //   {
      //     name: 'healthCheckerUseCase',
      //     class: HealthCheckerUseCase
      //   }
      // ]);

      this.registerSingletonClass([
        HealthCheckerUseCase,
        ReservationCreateUseCase,
        ReservationUpdateUseCase,
        ReservationGetUseCase,
        ReservationListUseCase,
        ReservationUpdateStatusUseCase,
        AuthenticationRegisterUseCase,
        AuthenticationLoginUseCase,
        AuthenticationRefreshUseCase
      ]);

      // Use cases
      this.registerSingletonFunctions([
        {
          name: 'repo',
          class: Repo
        }
      ]);
      // Controllers
      this.registerSingletonClass([HealthController, AuthenticationController, ReservationController]);

      this.registerSingletonClass([ReservationDao]);
      this.registerSingletonClass([UserDao]);

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
