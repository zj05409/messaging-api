import { IMessageDao } from '@/persistence/message/message.dao';
import { GetMessageRequest } from '@application/message/message-get.request';
import { BaseUseCase } from '@application/shared/base.usecase';
import { Message } from '@domain/message/message';
import { ForbiddenError } from '@infrastructure/errors';

class MessageGetUseCase implements BaseUseCase<GetMessageRequest, Promise<Message>> {
  private messageDao: IMessageDao;

  constructor(messageDao: IMessageDao) {
    this.messageDao = messageDao;
  }

  async execute(request: GetMessageRequest): Promise<Message> {
    const message = await this.messageDao.getMessage(request.id);
    if (!message) {
      throw new ForbiddenError();
    }
    return message;
  }
}

export { MessageGetUseCase };
