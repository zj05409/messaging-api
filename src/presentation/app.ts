import 'reflect-metadata';
import 'source-map-support/register';

import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
// const { GraphQLScalarType, Kind } = require('graphql');
import { ApolloServer, gql } from 'apollo-server-express';
// import {DateTime} from "luxon";
import { plainToClass } from 'class-transformer';
import {
  validate
  // validateOrReject,
  // validateOrReject,
  // Contains,
  // IsInt,
  // Length,
  // IsEmail,
  // IsFQDN,
  // IsDate,
  // Min,
  // Max,
} from 'class-validator';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import endent from 'endent';
import express, { Application } from 'express';
import figlet from 'figlet';
import helmet from 'helmet';
// import { Reservation } from '@domain/reservation/reservation';
import * as http from 'http';
import gracefulShutdown from 'http-graceful-shutdown';
import path from 'path';
import { useExpressServer } from 'routing-controllers';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

import { CreateReservationRequest } from '@application/reservation/reservation-create.request';
import { checkRole, checkUser } from '@application/token';
import { LOGGER } from '@domain/shared';
import { DomainError } from '@domain/shared/domain.error';
import { GlobalConfig } from '@infrastructure/shared/config';
import { DiContainer } from '@infrastructure/shared/di/di-container';
import { ReservationController } from '@presentation/controllers/reservation';

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
    const ReservationFragment = (suffix: string) => `
        _id: String
        _rev: String
        userId: String!
        name: String!
        contactInfo: ContactInfo${suffix}!
        expectedArriveTime: String!
        table: ReservationTable${suffix}!
    `;
    const ContactInfoFragment = `
        email: String
        tel: String!
    `;
    const ReservationTableFragment = `
        personCount: Int!
        babyCount: Int!
        position: String!
    `;
    const typeDefs = gql`
      input ContactInfoInput {
        ${ContactInfoFragment}
      }

      input ReservationTableInput {
        ${ReservationTableFragment}
      }
      type ContactInfoOutput {
        ${ContactInfoFragment}
      }

      type ReservationTableOutput {
        ${ReservationTableFragment}
      }

      type CreateReservationResponse {
          ${ReservationFragment('Output')}
      }
      type Reservation {
          ${ReservationFragment('Output')}
      }
      input ReservationInput {
          ${ReservationFragment('Input')}
      }
      type Mutation {
        createReservation(
          reservation: ReservationInput!
        ): CreateReservationResponse!
      }
      type Query {
        getReservation(
          id: String!
        ): Reservation
      }
    `;
    // const dateScalar = new GraphQLScalarType({
    //   name: 'Date',
    //   description: 'Date custom scalar type',
    //   serialize(value:Date):string {
    //
    //     return DateTime.fromJSDate(value as Date).toFormat('yyyy-LL-dd HH:mm')
    //     // return value.getTime(); // Convert outgoing Date to integer for JSON
    //   },
    //   parseValue(value:string):Date {
    //
    //     return DateTime.fromFormat(value as string, 'yyyy-LL-dd HH:mm').toJSDate()
    //     // return new Date(value); // Convert incoming integer to Date
    //   },
    //   parseLiteral(ast:any) {
    //     if (ast.kind === Kind.INT) {
    //       return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    //     } else  if (ast.kind === Kind.STRING) {
    //       return DateTime.fromFormat(ast.value as string, 'yyyy-LL-dd HH:mm').toJSDate()
    //       // return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    //     }
    //     return null; // Invalid hard-coded value (not an integer)
    //   },
    // });
    const resolvers = {
      // Date: dateScalar,
      Query: {
        getReservation: async () => {
          return null;
        }
      },
      Mutation: {
        createReservation: async (_: any, arguments_: { reservation: any }) => {
          const reservationController: ReservationController = DiContainer.diContainer.resolve(
            'reservationController'
          ) as ReservationController;
          try {
            const reservationParsed = plainToClass(CreateReservationRequest, arguments_.reservation);
            const errors = await validate(reservationParsed);
            if (errors.length > 0) {
              throw new DomainError('validationError', errors.toString());
            }
            return await reservationController.createReservation(reservationParsed);
          } finally {
            LOGGER.info('CreateReservation:' + JSON.stringify(arguments_.reservation));
          }
        }
      }
    };
    const httpServer = http.createServer(this.app);
    this.apolloServer = new ApolloServer({
      debug: true,
      typeDefs: typeDefs,
      resolvers: resolvers,
      csrfPrevention: true,
      cache: 'bounded',
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
       Base Path: ${this.basePath}
       OpenApi Spec Path: ${this.basePath}/spec
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
