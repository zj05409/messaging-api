// import { gql } from 'apollo-server-express';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { withFilter } from 'graphql-subscriptions';
import gql from 'graphql-tag';

import { CreateChatRequest } from '@application/chat/chat-create.request';
import { CreateMessageRequest } from '@application/message/message-create.request';
import { Token } from '@application/token';
import { LOGGER } from '@domain/shared';
import { Role } from '@domain/user/role';
import { UnauthorizedError } from '@infrastructure/errors';
import { DiContainer } from '@infrastructure/shared/di/di-container';
import { ChatController } from '@presentation/controllers/chat';

const ChatFragment = `
        id: String
        chatType: ChatType!
        name: String!
        avatar: String!
    `;
const MessageFragment = `
        id: String
        chatId: String!
        userId: String!
        messageType: MessageType!
        content: String!
        referenceExtract: String
        referenceMessageId: String
        ats: [String!]
        atIds: [String!]
    `;
const checkHasRole = (context: { currentUser: Token }, ...roles: Role[]) => {
  if (!context.currentUser || roles.every(role => !context.currentUser.roles?.includes(role))) {
    throw new UnauthorizedError();
  }
};
const checkIsUser = (context: { currentUser: Token }) => {
  return checkHasRole(context, Role.User);
};

const controller = () => {
  const chatController: ChatController = DiContainer.diContainer.resolve('chatController') as ChatController;
  return chatController;
};

const typeDefinitions = gql`
  enum ChatType {
    Simple
    Group
  }

  enum MessageType {
    Text
    Image
  }

  type Chat {
      ${ChatFragment}
  }
  input ChatInput {
      ${ChatFragment}
  }

  type UserDetail {
      userId: String!
      username: String!
      email: String!
      avatar: String!
  }
  type ChatDetail {
      ${ChatFragment}
      users: [UserDetail!]!
  }

  type Message {
      ${MessageFragment}
      read: Boolean
      createdAt: String!
  }
  input MessageInput {
      ${MessageFragment}
  }

  extend type Mutation {
    createChat(
      chat: ChatInput!
    ): Chat!
    createMessage(
      message: MessageInput!
    ): Message!
    deleteMessage(
      id: String!
    ): String
  }
  extend type Query {
    getChat(
      id: String!
    ): ChatDetail
    listAllChat: [Chat!]! 
    getMessage(
      id: String!
    ): Message
    listMessage(
      chatId: String
    ): [Message!]! 
  }
  extend type Subscription {
    messageCreated: Message
    messageDeleted: String
    hello: String
  }
`;
const resolvers = {
  // Date: dateScalar,
  Query: {
    getChat: async (_: any, arguments_: { id: string }, context: { currentUser: Token }) => {
      try {
        checkIsUser(context);
        const chatController = controller();
        return await chatController.getChat(arguments_.id, context.currentUser);
      } finally {
        LOGGER.info('GetChat:' + arguments_.id);
      }
    },
    listAllChat: async (_: any, _arguments: any, context: { currentUser: Token }) => {
      try {
        checkIsUser(context);
        const chatController = controller();
        return await chatController.listChat(context.currentUser);
      } finally {
        LOGGER.info('ListAllChat:');
      }
    },
    getMessage: async (_: any, arguments_: { id: string }, context: { currentUser: Token }) => {
      try {
        checkIsUser(context);
        const chatController = controller();
        return await chatController.getMessage(arguments_.id, context.currentUser);
      } finally {
        LOGGER.info('GetMessage:' + arguments_.id);
      }
    },
    listMessage: async (_: any, _arguments: { chatId: string | null }, context: { currentUser: Token }) => {
      try {
        checkIsUser(context);
        const chatController = controller();
        return await chatController.listMessage(_arguments.chatId, context.currentUser);
      } finally {
        LOGGER.info('ListMessage:');
      }
    }
  },
  Mutation: {
    createChat: async (_: any, arguments_: { chat: any }, context: { currentUser: Token }) => {
      checkIsUser(context);
      const chatController = controller();
      try {
        const chatParsed = plainToClass(CreateChatRequest, arguments_.chat);
        await validateOrReject(chatParsed);
        // return await chatController.createChat(chatParsed, context.currentUser);
        return await chatController.createChat(chatParsed);
      } finally {
        LOGGER.info('CreateChat:' + JSON.stringify(arguments_.chat));
      }
    },
    createMessage: async (_: any, arguments_: { message: any }, context: { pubsub: any; currentUser: Token }) => {
      checkIsUser(context);
      const chatController = controller();
      try {
        const messageParsed = plainToClass(CreateMessageRequest, arguments_.message);
        await validateOrReject(messageParsed);
        // return await chatController.createChat(chatParsed, context.currentUser);
        const message = await chatController.createMessage(messageParsed.chatId, context.currentUser, messageParsed);
        context.pubsub.publish('MESSAGE_CREATED', { messageCreated: message });
        return message;
      } finally {
        LOGGER.info('CreateMessage:' + JSON.stringify(arguments_.message));
      }
    },
    deleteMessage: async (_: any, arguments_: { id: any }, context: { pubsub: any; currentUser: Token }) => {
      checkIsUser(context);
      const chatController = controller();
      try {
        await chatController.deleteMessage(arguments_.id, context.currentUser);
        context.pubsub.publish('MESSAGE_DELETED', { messageDeleted: arguments_.id });
        return '';
      } finally {
        LOGGER.info('DeleteMessage:' + JSON.stringify(arguments_.id));
      }
    }
  },
  Subscription: {
    messageCreated: {
      subscribe: withFilter(
        (_1, _2, context, _3) => context.pubsub.asyncIterator(['MESSAGE_CREATED']),
        (payload, variables) => {
          // Only push an update if the comment is on
          // the correct repository for this operation
          // return payload.commentAdded.repository_name === variables.repoFullName;
          return (!!payload && !!variables) || true;
        }
      )
    },
    messageDeleted: {
      subscribe: withFilter(
        (_1, _2, context, _3) => context.pubsub.asyncIterator(['MESSAGE_DELETED']),
        (payload, variables) => {
          // Only push an update if the comment is on
          // the correct repository for this operation
          // return payload.commentAdded.repository_name === variables.repoFullName;
          return (!!payload && !!variables) || true;
        }
      )
    },
    hello: {
      // Example using an async generator
      // subscribe: () => {
      //   return ['Hello', 'Bonjour', 'Ciao'];
      // }
      // Example using an async generator
      subscribe: async function* () {
        for await (const word of ['Hello', 'Bonjour', 'Ciao']) {
          yield { hello: word };
        }
      }
    }
  }
};

export { resolvers, typeDefinitions };
