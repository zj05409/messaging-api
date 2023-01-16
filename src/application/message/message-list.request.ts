// import 'reflect-metadata';

import { classToPlain, plainToClass } from 'class-transformer';

class ListMessageRequest {
  userId: string;

  chatId: string | null;

  static fromJson(json: any) {
    return plainToClass(ListMessageRequest, json);
  }

  toJson() {
    return classToPlain(this);
  }
}

export { ListMessageRequest };
