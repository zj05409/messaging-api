import { IMessageDao } from '@/persistence/message/message.dao';
import { GetMessageRequest } from '@application/message/message-get.request';
import { BaseUseCase } from '@application/shared/base.usecase';

class MessageDeleteUseCase implements BaseUseCase<GetMessageRequest, Promise<void>> {
  private messageDao: IMessageDao;

  constructor(messageDao: IMessageDao) {
    this.messageDao = messageDao;
  }

  async execute(request: GetMessageRequest): Promise<void> {
    await this.messageDao.deleteMessage(request.id);
  }
}

export { MessageDeleteUseCase };
