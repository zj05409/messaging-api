// import 'reflect-metadata';

import { classToPlain } from 'class-transformer';
import { MinLength } from 'class-validator';

import { MessageType } from '@domain/message/message-type';

class CreateMessageRequest {
  @MinLength(1)
  chatId: string;

  @MinLength(1)
  userId: string;

  @MinLength(1)
  content: string;

  referenceExtract: string;

  referenceMessageId: string;

  ats: string[];

  atIds: string[];

  messageType: MessageType;

  toJson() {
    return classToPlain(this);
  }
}

export { CreateMessageRequest };
