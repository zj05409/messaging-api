import { StatusCodes } from 'http-status-codes';
import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  UseBefore
} from 'routing-controllers';

import { UserGetUseCase } from '@application/authentication/user-get.usecase';
import { CreateChatRequest } from '@application/chat/chat-create.request';
import { CreateChatResponse } from '@application/chat/chat-create.response';
import { ChatCreateUseCase } from '@application/chat/chat-create.usecase';
import { GetChatRequest } from '@application/chat/chat-get.request';
import { ChatGetUseCase } from '@application/chat/chat-get.usecase';
import { ListChatRequest } from '@application/chat/chat-list.request';
import { ChatListUseCase } from '@application/chat/chat-list.usecase';
import { CreateMessageRequest } from '@application/message/message-create.request';
import { CreateMessageResponse } from '@application/message/message-create.response';
import { MessageCreateUseCase } from '@application/message/message-create.usecase';
import { DeleteMessageRequest } from '@application/message/message-delete.request';
import { MessageDeleteUseCase } from '@application/message/message-delete.usecase';
import { GetMessageRequest } from '@application/message/message-get.request';
import { MessageGetUseCase } from '@application/message/message-get.usecase';
import { ListMessageRequest } from '@application/message/message-list.request';
import { MessageListUseCase } from '@application/message/message-list.usecase';
import { Token } from '@application/token';
import { Chat } from '@domain/chat/chat';
import { Message } from '@domain/message/message';
import { LOGGER } from '@domain/shared';
import { Role } from '@domain/user/role';
import { AuthenticationMiddleware } from '@presentation/middlewares';

import { GetChatResponse } from './chat-get.response';
// import {Chat} from "@domain/chat/chat";

@JsonController('/chat')
class ChatController {
  private chatListUseCase: ChatListUseCase;

  private chatGetUseCase: ChatGetUseCase;

  private chatCreateUseCase: ChatCreateUseCase;

  private messageListUseCase: MessageListUseCase;

  private messageGetUseCase: MessageGetUseCase;

  private messageCreateUseCase: MessageCreateUseCase;

  private messageDeleteUseCase: MessageDeleteUseCase;

  private userGetUseCase: UserGetUseCase;

  constructor(
    chatListUseCase: ChatListUseCase,
    chatGetUseCase: ChatGetUseCase,
    chatCreateUseCase: ChatCreateUseCase,
    messageListUseCase: MessageListUseCase,
    messageGetUseCase: MessageGetUseCase,
    messageCreateUseCase: MessageCreateUseCase,
    userGetUseCase: UserGetUseCase,
    messageDeleteUseCase: MessageDeleteUseCase
  ) {
    this.chatListUseCase = chatListUseCase;
    this.chatGetUseCase = chatGetUseCase;
    this.chatCreateUseCase = chatCreateUseCase;
    this.messageListUseCase = messageListUseCase;
    this.messageGetUseCase = messageGetUseCase;
    this.messageCreateUseCase = messageCreateUseCase;
    this.userGetUseCase = userGetUseCase;
    this.messageDeleteUseCase = messageDeleteUseCase;
  }

  @Get('/:id')
  @UseBefore(AuthenticationMiddleware)
  @Authorized(['User'])
  @HttpCode(StatusCodes.OK)
  async getChat(@Param('id') id: string, @CurrentUser() user?: Token): Promise<GetChatResponse> {
    // console.log(chat);
    const request = new GetChatRequest();
    request.id = id;
    if (user && !user.roles?.includes(Role.User)) {
      request.userId = user?.userId;
    }
    try {
      const chat = await this.chatGetUseCase.execute(request);
      // const userIds = ['jacob1', 'jacob2', 'jacob3'];
      const users = await this.userGetUseCase.execute([]);
      return new GetChatResponse(chat.id, chat.chatType, chat.name, chat.avatar, users);
    } catch (error) {
      LOGGER.error(error);
      throw error;
    }
    // return Promise.resolve(new CreateChatResponse('id1'));//
  }

  @Get()
  @UseBefore(AuthenticationMiddleware)
  @Authorized(['User'])
  @HttpCode(StatusCodes.OK)
  async listChat(@CurrentUser() user?: Token): Promise<Chat[]> {
    // console.log(chat);
    const request = new ListChatRequest();
    if (user && !user.roles?.includes(Role.User)) {
      request.userId = user?.userId;
    }
    try {
      return await this.chatListUseCase.execute(request);
    } catch (error) {
      LOGGER.error(error);
      throw error;
    }
    // return Promise.resolve(new CreateChatResponse('id1'));//
  }

  @Post()
  @UseBefore(AuthenticationMiddleware)
  @Authorized('User')
  @HttpCode(StatusCodes.OK)
  async createChat(
    @Body({ validate: true }) request: CreateChatRequest
    // @CurrentUser() user?: Token
  ): Promise<CreateChatResponse> {
    // console.log(chat);
    // if (user) {
    //   request.userId = user.username;
    // }
    try {
      return await this.chatCreateUseCase.execute(request);
    } catch (error) {
      LOGGER.error(error);
      throw error;
    }
    // return Promise.resolve(new CreateChatResponse('id1'));//
  }

  @Get('/:chatId/message/:id')
  @UseBefore(AuthenticationMiddleware)
  @Authorized(['User'])
  @HttpCode(StatusCodes.OK)
  async getMessage(@Param('id') id: string, @CurrentUser() user?: Token): Promise<CreateMessageResponse> {
    // console.log(message);
    const request = new GetMessageRequest();
    request.id = id;
    if (user && !user.roles?.includes(Role.User)) {
      request.userId = user?.userId;
    }
    try {
      return await this.messageGetUseCase.execute(request);
    } catch (error) {
      LOGGER.error(error);
      throw error;
    }
    // return Promise.resolve(new CreateMessageResponse('id1'));//
  }

  @Get('/:chatId/message')
  @UseBefore(AuthenticationMiddleware)
  @Authorized(['User'])
  @HttpCode(StatusCodes.OK)
  async listMessage(@Param('chatId') chatId: string | null, @CurrentUser() user?: Token): Promise<Message[]> {
    // console.log(message);
    const request = new ListMessageRequest();
    request.chatId = chatId;
    if (user && !user.roles?.includes(Role.User)) {
      request.userId = user?.userId;
    }
    try {
      return await this.messageListUseCase.execute(request);
      // return result.map(r => r.toJson())
    } catch (error) {
      LOGGER.error(error);
      throw error;
    }
    // return Promise.resolve(new CreateMessageResponse('id1'));//
  }

  @Post('/:chatId/message')
  @UseBefore(AuthenticationMiddleware)
  @Authorized('User')
  @HttpCode(StatusCodes.OK)
  async createMessage(
    @Param('chatId') chatId: string,
    @CurrentUser() user: Token,
    @Body({ validate: true }) request: CreateMessageRequest
    // @CurrentUser() user?: Token
  ): Promise<CreateMessageResponse> {
    // console.log(message);
    request.userId = user.username;
    request.chatId = chatId;
    try {
      return await this.messageCreateUseCase.execute(request);
    } catch (error) {
      LOGGER.error(error);
      throw error;
    }
    // return Promise.resolve(new CreateMessageResponse('id1'));//
  }

  @Delete('/:chatId/message/:id')
  @UseBefore(AuthenticationMiddleware)
  @Authorized(['User'])
  @HttpCode(StatusCodes.OK)
  async deleteMessage(@Param('id') id: string, @CurrentUser() user?: Token): Promise<void> {
    // console.log(message);
    const request = new DeleteMessageRequest();
    request.id = id;
    if (user && !user.roles?.includes(Role.User)) {
      request.userId = user?.userId;
    }
    try {
      await this.messageDeleteUseCase.execute(request);
    } catch (error) {
      LOGGER.error(error);
      throw error;
    }
    // return Promise.resolve(new CreateMessageResponse('id1'));//
  }
}

export { ChatController };
