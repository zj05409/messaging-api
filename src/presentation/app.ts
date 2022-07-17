import 'reflect-metadata';
import 'source-map-support/register';

import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
// const { GraphQLScalarType, Kind } = require('graphql');
import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import endent from 'endent';
import express, { Application } from 'express';
import figlet from 'figlet';
import helmet from 'helmet';
// import { Reservation } from '@domain/reservation/reservation';
import * as http from 'http';
import gracefulShutdown from 'http-graceful-shutdown';
import { merge } from 'lodash';
import path from 'path';
import { useExpressServer } from 'routing-controllers';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

import { checkRole, checkUser, tokenProvider } from '@application/token';
import { LOGGER } from '@domain/shared';
import { GlobalConfig } from '@infrastructure/shared/config';
import {
  resolvers as authenticationResolvers,
  typeDefinitions as Authentication
} from '@presentation/controllers/authentication/authentication.graphql';
import { ReservationController } from '@presentation/controllers/reservation';
import {
  resolvers as reservationResolvers,
  typeDefinitions as Reservation
} from '@presentation/controllers/reservation/reservation.graphql';

import { AppConfig, AppInfo } from './config/app.config';
import { AuthenticationController } from './controllers/authentication';
import { HealthController } from './controllers/health';
import { ErrorHandlerMiddleware, MorganMiddleware, NotFoundMiddleware } from './middlewares';
// import {User} from "@domain/user/user";

class App {
  public app: Application;

  public name: string;

  public port: number;

  public basePath: string;

  public env: string;

  public server: any;

  public apolloServer: ApolloServer;

  constructor() {
    this.app = express();
    this.name = AppInfo.APP_NAME;
    this.port = AppConfig.PORT;
    this.basePath = AppConfig.BASE_PATH;
    this.env = GlobalConfig.ENVIRONMENT;
    if (this.env === 'test') {
      this.initializeExternalMiddlewares();
      this.initializeSwagger();
      this.initializeApplication();
    }
  }

  public async start(): Promise<void> {
    const Query = `
      type Query {
        _empty: String
      }
    `;
    const Mutation = `
      type Mutation {
        _empty: String
      }
    `;
    const resolvers = {};
    const httpServer = http.createServer(this.app);
    this.apolloServer = new ApolloServer({
      debug: true,
      typeDefs: [Query, Mutation, Authentication, Reservation],
      resolvers: merge(resolvers, authenticationResolvers, reservationResolvers),
      csrfPrevention: true,
      cache: 'bounded',

      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (!auth || !auth.toLowerCase().startsWith('bearer ')) {
          return {};
        }
        const token = tokenProvider.getTokenFromHeader(auth);

        if (!tokenProvider.validateAccessToken(token)) {
          return {};
        }
        return { currentUser: tokenProvider.parseToken(token) };
      },
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    });
    await this.apolloServer.start();

    this.initializeExternalMiddlewares();

    this.apolloServer.applyMiddleware({ app: this.app });
    this.initializeSwagger();
    this.initializeApplication();

    this.server = httpServer.listen({ port: this.port });
    this.showBanner();
    // this.server =  this.app.listen(this.port, () => this.showBanner());

    // await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));

    gracefulShutdown(this.server, {
      forceExit: true,
      // preShutdown?: (signal?: string) => Promise<void>;
      // onShutdown?: (signal?: string) => Promise<void>;
      finally: () => {
        LOGGER.info('Server gracefully shut down!');
      }
    });
  }

  public async stop(): Promise<void> {
    gracefulShutdown(this.server, {
      forceExit: true,
      finally: () => {
        LOGGER.info('Server gracefully shut down!');
      }
    });
  }

  public getServer(): Application {
    return this.app;
  }

  private initializeExternalMiddlewares(): void {
    this.app.use(express.static('public'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(helmet());
    // const corsOptions = {
    //   origin: 'http://localhost:8000',
    //   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    // }
    this.app.use(cors());
  }

  private initializeSwagger(): void {
    const swaggerDefinition = {
      openapi: '3.0.3',
      info: {
        title: this.name,
        version: AppInfo.APP_VERSION,
        description: AppInfo.APP_DESCRIPTION,
        license: {
          name: 'Licensed Under MIT',
          url: 'https://spdx.org/licenses/MIT.html'
        },
        contact: {
          name: AppInfo.AUTHOR_NAME,
          email: AppInfo.AUTHOR_EMAIL,
          url: AppInfo.AUTHOR_WEBSITE
        }
      },
      servers: [{ url: this.basePath }]
    };

    const jsDocumentOptions = {
      swaggerDefinition,
      apis: [path.join(__dirname, './**/*oas.yml')]
    };

    const swaggerUiOptions = {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: `${this.name} - OAS3`
    };

    const swaggerSpec = swaggerJSDoc(jsDocumentOptions);
    this.app.use(
      `${this.basePath}/spec`,
      swaggerUiExpress.serve,
      swaggerUiExpress.setup(swaggerSpec, swaggerUiOptions)
    );
  }

  private initializeApplication(): void {
    useExpressServer(this.app, {
      routePrefix: this.basePath,
      controllers: [AuthenticationController, HealthController, ReservationController],
      middlewares: [MorganMiddleware, NotFoundMiddleware, ErrorHandlerMiddleware],
      authorizationChecker: checkRole,
      currentUserChecker: checkUser,
      classTransformer: true
    });
  }

  private showBanner(): void {
    const banner = endent`Application started successfully!
      ${figlet.textSync(this.name)}
       Name: ${this.name}
       Description: ${AppInfo.APP_DESCRIPTION}
       Version: ${AppInfo.APP_VERSION}
       Port: ${this.port}
       Api Base Path: http://localhost:${this.port}${this.basePath}
       Mobile H5 Frontend Path: http://localhost:${this.port}
       GraphQL Api Path: http://localhost:${this.port}/graphql
       OpenApi Spec Path: http://localhost:${this.port}${this.basePath}/spec
       Environment: ${this.env}
       Author: ${AppInfo.AUTHOR_NAME}
       Email: ${AppInfo.AUTHOR_EMAIL}
       Website: ${AppInfo.AUTHOR_WEBSITE}
       Copyright © ${new Date().getFullYear()} ${AppInfo.AUTHOR_EMAIL}. All rights reserved.
    `;
    LOGGER.info(banner);
  }
}

export { App };
