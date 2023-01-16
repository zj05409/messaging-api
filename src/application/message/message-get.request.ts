// import 'reflect-metadata';

import { classToPlain, plainToClass } from 'class-transformer';

class GetMessageRequest {
  id: string;

  userId: string;

  static fromJson(json: any) {
    return plainToClass(GetMessageRequest, json);
  }

  toJson() {
    return classToPlain(this);
  }
}

export { GetMessageRequest };
