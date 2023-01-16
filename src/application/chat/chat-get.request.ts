// import 'reflect-metadata';

import { classToPlain, plainToClass } from 'class-transformer';

class GetChatRequest {
  id: string;

  userId: string;

  static fromJson(json: any) {
    return plainToClass(GetChatRequest, json);
  }

  toJson() {
    return classToPlain(this);
  }
}

export { GetChatRequest };
