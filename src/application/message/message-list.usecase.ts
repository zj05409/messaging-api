import { IMessageDao } from '@/persistence/message/message.dao';
import { ListMessageRequest } from '@application/message/message-list.request';
import { BaseUseCase } from '@application/shared/base.usecase';
import { Message } from '@domain/message/message';

class MessageListUseCase implements BaseUseCase<ListMessageRequest, Promise<Message[]>> {
  private messageDao: IMessageDao;

  constructor(messageDao: IMessageDao) {
    this.messageDao = messageDao;
  }

  async execute(request: ListMessageRequest): Promise<Message[]> {
    return this.messageDao.listMessage(request.userId, request.chatId);
  }
}

export { MessageListUseCase };
