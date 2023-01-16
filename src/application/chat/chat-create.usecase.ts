import { IChatDao } from '@/persistence/chat/chat.dao';
import { CreateChatRequest } from '@application/chat/chat-create.request';
import { BaseUseCase } from '@application/shared/base.usecase';
import { Chat } from '@domain/chat/chat';

import { CreateChatResponse } from './chat-create.response';

class ChatCreateUseCase implements BaseUseCase<CreateChatRequest, Promise<CreateChatResponse>> {
  private chatDao: IChatDao;

  constructor(chatDao: IChatDao) {
    this.chatDao = chatDao;
  }

  async execute(request: CreateChatRequest): Promise<CreateChatResponse> {
    const result = await this.chatDao.createOrReplaceChat(new Chat(request.chatType, request.name, request.avatar));
    return CreateChatResponse.fromDomainModel(result);
  }
}

export { ChatCreateUseCase };
