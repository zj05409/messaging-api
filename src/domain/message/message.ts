import 'reflect-metadata';

import { classToPlain, Transform } from 'class-transformer';

import { MessageType } from '@domain/message/message-type';
import dateTransformer from '@domain/shared/date.transformer';

class Message {
  @Transform(dateTransformer)
  createdAt: Date;

  id: string;

  chatId: string;

  userId: string;

  messageType: MessageType;

  content: string;

  referenceExtract: string | null;

  referenceMessageId: string | null;

  ats: string[];

  atIds: string[];

  constructor(
    chatId: string,
    userId: string,
    messageType: MessageType,
    content: string,
    referenceExtract: string | null,
    referenceMessageId: string | null,
    ats: string[],
    atIds: string[],
    id = '',
    createdAt = new Date()
  ) {
    if (id) {
      this.id = id;
    }
    this.chatId = chatId;
    this.userId = userId;
    this.messageType = messageType;
    this.content = content;
    this.referenceExtract = referenceExtract;
    this.referenceMessageId = referenceMessageId;
    this.ats = ats;
    this.atIds = atIds;
    this.createdAt = createdAt;
  }

  toJson() {
    return classToPlain(this);
  }
}

export { Message };
