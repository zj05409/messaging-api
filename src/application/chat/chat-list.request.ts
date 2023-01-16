// import 'reflect-metadata';

import { classToPlain, plainToClass } from 'class-transformer';

class ListChatRequest {
  userId: string;

  static fromJson(json: any) {
    return plainToClass(ListChatRequest, json);
  }

  toJson() {
    return classToPlain(this);
  }
}

export { ListChatRequest };
