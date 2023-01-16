// import 'reflect-metadata';

import { classToPlain, plainToClass } from 'class-transformer';

class DeleteMessageRequest {
  id: string;

  userId: string;

  static fromJson(json: any) {
    return plainToClass(DeleteMessageRequest, json);
  }

  toJson() {
    return classToPlain(this);
  }
}

export { DeleteMessageRequest };
