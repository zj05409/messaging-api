import { Chat } from '@domain/chat/chat';
import { ChatType } from '@domain/chat/chat-type';

class CreateChatResponse extends Chat {
  constructor(id: string, chatType: ChatType, name: string, avatar: string) {
    super(chatType, name, avatar);
    this.id = id;
  }

  public static fromDomainModel(chat: Chat): CreateChatResponse {
    return new CreateChatResponse(chat.id, chat.chatType, chat.name, chat.avatar);
  }
}

export { CreateChatResponse };
