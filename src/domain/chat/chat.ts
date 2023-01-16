import { classToPlain } from 'class-transformer';

import { ChatType } from '@domain/chat/chat-type';

class Chat {
  id: string;

  chatType: ChatType;

  name: string;

  avatar: string;

  constructor(chatType: ChatType, name: string, avatar: string, id = '') {
    if (id) {
      this.id = id;
    }
    this.chatType = chatType;
    this.name = name;
    this.avatar = avatar;
  }

  toJson() {
    return classToPlain(this);
  }
}

export { Chat };
