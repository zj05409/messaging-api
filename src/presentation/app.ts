import 'reflect-metadata';
import 'source-map-support/register';

// import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
// const { GraphQLScalarType, Kind } = require('graphql');
import { ApolloServer } from '@apollo/server';
// import { ApolloServer } from 'apollo-server-express';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import endent from 'endent';
import express, { Application } from 'express';
import figlet from 'figlet';
import { PubSub } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';
import helmet from 'helmet';
import * as http from 'http';
import gracefulShutdown from 'http-graceful-shutdown';
import { merge } from 'lodash';
import { useExpressServer } from 'routing-controllers';
import { WebSocketServer } from 'ws';

import { checkRole, checkUser, tokenProvider } from '@application/token';
import { LOGGER } from '@domain/shared';
import { GlobalConfig } from '@infrastructure/shared/config';
import {
  resolvers as authenticationResolvers,
  typeDefinitions as Authentication
} from '@presentation/controllers/authentication/authentication.graphql';
import { ChatController } from '@presentation/controllers/chat';
import { resolvers as chatResolvers, typeDefinitions as Chat } from '@presentation/controllers/chat/chat.graphql';

import { AppConfig, AppInfo } from './config/app.config';
import { AuthenticationController } from './controllers/authentication';
import { HealthController } from './controllers/health';
import { ErrorHandlerMiddleware, MorganMiddleware, NotFoundMiddleware } from './middlewares';
// import {User} from "@domain/user/user";

const pubsub = new PubSub();
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
    const Subscription = `
      type Subscription {
        _empty: String
      }
    `;
    const resolvers = {};
    const httpServer = http.createServer(this.app);
    const schema = makeExecutableSchema({
      typeDefs: [Query, Mutation, Subscription, Authentication, Chat],
      resolvers: merge(resolvers, authenticationResolvers, chatResolvers)
    });
    const wsServer = new WebSocketServer({
      // This is the `httpServer` we created in a previous step.
      server: httpServer,
      // Pass a different path here if app.use
      // serves expressMiddleware at a different path
      // path: '/graphql'
      path: '/subscription'
    });

    // Hand in the schema we just created and have the
    // WebSocketServer start listening.
    const serverCleanup = useServer(
      {
        schema,
        // As before, ctx is the graphql-ws Context where connectionParams live.
        onConnect: async context => {
          // Check authentication every time a client connects.
          if (!context.connectionParams) {
            // You can return false to close the connection  or throw an explicit error
            throw new Error('Auth token missing!');
          }
        },
        onDisconnect: async () => {
          console.log('Disconnected!');
        },
        context: async context => {
          // You can define your own function for setting a dynamic context
          // or provide a static value
          // ctx is the graphql-ws Context where connectionParams live
          const auth = context && context.connectionParams ? String(context.connectionParams.authentication) : null;
          if (!auth || !auth.toLowerCase().startsWith('bearer ')) {
            return {};
          }
          const token = tokenProvider.getTokenFromHeader(auth);

          if (!tokenProvider.validateAccessToken(token)) {
            return {};
          }
          return { currentUser: tokenProvider.parseToken(token), pubsub };
        }
      },
      wsServer
    );
    // const io = new Server(httpServer, {
    //   // options
    // });

    // io.on('connection', socket => {
    //   socket.emit('toast', 'connected');
    //   // ...
    // });
    // io.on('set_token', socket => {
    //   socket.write('hello');
    //   // ...
    // });
    this.apolloServer = new ApolloServer({
      schema,
      csrfPrevention: true,
      cache: 'bounded',

      plugins: [
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),

        // Proper shutdown for the WebSocket server.
        {
          // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
          async serverWillStart() {
            return {
              // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
              async drainServer() {
                await serverCleanup.dispose();
              }
            };
          }
        }
      ]
    });
    await this.apolloServer.start();

    this.initializeExternalMiddlewares();

    this.app.use(
      '/graphql',
      expressMiddleware(this.apolloServer, {
        context: async ({ req }) => {
          const auth = req ? req.headers.authorization : null;
          if (!auth || !auth.toLowerCase().startsWith('bearer ')) {
            return {};
          }
          const token = tokenProvider.getTokenFromHeader(auth);

          if (!tokenProvider.validateAccessToken(token)) {
            return {};
          }
          return { currentUser: tokenProvider.parseToken(token), pubsub };
        }
      })
    );
    this.initializeApplication();

    this.server = httpServer.listen({ port: this.port });
    this.showBanner();

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
    this.app.use(express.static('public', {}));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(helmet());
    this.app.use(cors());
  }

  private initializeApplication(): void {
    useExpressServer(this.app, {
      routePrefix: this.basePath,
      controllers: [AuthenticationController, HealthController, ChatController],
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
