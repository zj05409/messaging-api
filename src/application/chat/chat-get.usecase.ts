import { IChatDao } from '@/persistence/chat/chat.dao';
import { GetChatRequest } from '@application/chat/chat-get.request';
import { BaseUseCase } from '@application/shared/base.usecase';
import { Chat } from '@domain/chat/chat';
import { ForbiddenError } from '@infrastructure/errors';

class ChatGetUseCase implements BaseUseCase<GetChatRequest, Promise<Chat>> {
  private chatDao: IChatDao;

  constructor(chatDao: IChatDao) {
    this.chatDao = chatDao;
  }

  async execute(request: GetChatRequest): Promise<Chat> {
    const chat = await this.chatDao.getChat(request.id);
    // eslint-disable-next-line sonarjs/no-redundant-boolean
    if (!chat || (request.userId && false) /* TODO: add filter logic: chat.userId !== request.userId*/) {
      throw new ForbiddenError();
    }
    return chat;
  }
}

export { ChatGetUseCase };
