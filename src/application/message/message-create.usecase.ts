import { IMessageDao } from '@/persistence/message/message.dao';
import { CreateMessageRequest } from '@application/message/message-create.request';
import { BaseUseCase } from '@application/shared/base.usecase';
import { Message } from '@domain/message/message';

import { CreateMessageResponse } from './message-create.response';

class MessageCreateUseCase implements BaseUseCase<CreateMessageRequest, Promise<CreateMessageResponse>> {
  private messageDao: IMessageDao;

  constructor(messageDao: IMessageDao) {
    this.messageDao = messageDao;
  }

  async execute(request: CreateMessageRequest): Promise<CreateMessageResponse> {
    const result = await this.messageDao.createOrReplaceMessage(
      new Message(
        request.chatId,
        request.userId,
        request.messageType,
        request.content,
        request.referenceExtract,
        request.referenceMessageId,
        request.ats,
        request.atIds
      )
    );
    return CreateMessageResponse.fromDomainModel(result);
  }
}

export { MessageCreateUseCase };
