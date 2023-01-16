import { IMessageDao } from '@/persistence/message/message.dao';
import { Message } from '@domain/message/message';
import { ForbiddenError } from '@infrastructure/errors';

class MessageDao implements IMessageDao {
  private sequence = 0;

  private messages: Message[] = [];

  async listMessage(userid: string | null, chatid: string): Promise<Message[]> {
    return this.messages.filter(m => m.chatId === chatid && (!userid || m.userId === userid));
  }

  async getMessage(id: string): Promise<Message | null> {
    const result = this.messages.find(r => r.id === id);
    if (result) {
      return result;
    } else {
      throw new ForbiddenError();
    }
  }

  async createOrReplaceMessage(message: Message): Promise<Message> {
    this.messages.push(message);
    this.sequence += 1;
    message.id = 'id' + this.sequence;
    return message;
  }

  async deleteMessage(id: string): Promise<void> {
    this.messages = this.messages.filter(m => m.id !== id);
  }
}

export { MessageDao };
