import { Message } from '@domain/message/message';
import { MessageType } from '@domain/message/message-type';

class CreateMessageResponse extends Message {
  constructor(
    id: string,
    chatId: string,
    userId: string,
    messageType: MessageType,
    content: string,
    referenceExtract: string | null,
    referenceMessageId: string | null,
    ats: string[],
    atIds: string[],
    createdAt: Date
  ) {
    super(chatId, userId, messageType, content, referenceExtract, referenceMessageId, ats, atIds, id, createdAt);
  }

  public static fromDomainModel(message: Message): CreateMessageResponse {
    return new CreateMessageResponse(
      message.id,
      message.chatId,
      message.userId,
      message.messageType,
      message.content,
      message.referenceExtract,
      message.referenceMessageId,
      message.ats,
      message.atIds,
      message.createdAt
    );
  }
}

export { CreateMessageResponse };
