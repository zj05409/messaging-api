// import 'reflect-metadata';

import { classToPlain, plainToClass } from 'class-transformer';

import { UserGetResponse } from '@application/authentication/user-get.response';
import { ChatType } from '@domain/chat/chat-type';

class GetChatResponse {
  constructor(
    readonly id: string,
    readonly chatType: ChatType,
    readonly name: string,
    readonly avatar: string,
    readonly users: UserGetResponse[]
  ) {}

  static fromJson(json: any) {
    return plainToClass(GetChatResponse, json);
  }

  toJson() {
    return classToPlain(this);
  }
}

export { GetChatResponse };
