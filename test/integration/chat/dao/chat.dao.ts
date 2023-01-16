import { IChatDao } from '@/persistence/chat/chat.dao';
import { Chat } from '@domain/chat/chat';
import { ForbiddenError } from '@infrastructure/errors';

class ChatDao implements IChatDao {
  private sequence = 0;

  private chats: Chat[] = [];

  async listChat(userid: string | null): Promise<Chat[]> {
    return userid ? this.chats.filter(r => !!r /* TODO: add filter logic */) : this.chats;
  }

  async getChat(id: string): Promise<Chat | null> {
    const result = this.chats.find(r => r.id === id);
    if (result) {
      return result;
    } else {
      throw new ForbiddenError();
    }
  }

  async createOrReplaceChat(chat: Chat): Promise<Chat> {
    this.chats.push(chat);
    this.sequence += 1;
    chat.id = 'id' + this.sequence;
    return chat;
  }
}

export { ChatDao };
