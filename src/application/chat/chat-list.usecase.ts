import { IChatDao } from '@/persistence/chat/chat.dao';
import { ListChatRequest } from '@application/chat/chat-list.request';
import { BaseUseCase } from '@application/shared/base.usecase';
import { Chat } from '@domain/chat/chat';

class ChatListUseCase implements BaseUseCase<ListChatRequest, Promise<Chat[]>> {
  private chatDao: IChatDao;

  constructor(chatDao: IChatDao) {
    this.chatDao = chatDao;
  }

  async execute(request: ListChatRequest): Promise<Chat[]> {
    return this.chatDao.listChat(request.userId);
  }
}

export { ChatListUseCase };
