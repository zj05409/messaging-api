// import 'reflect-metadata';

import { classToPlain } from 'class-transformer';
import { MinLength } from 'class-validator';

import { ChatType } from '@domain/chat/chat-type';

class CreateChatRequest {
  @MinLength(2)
  name: string;

  @MinLength(0)
  avatar: string;

  chatType: ChatType;

  toJson() {
    return classToPlain(this);
  }
}

export { CreateChatRequest };
