import { PersistenceError } from '@/persistence/shared/persistence.error';
import { Chat } from '@domain/chat/chat';
import { ChatType } from '@domain/chat/chat-type';
import { LOGGER } from '@domain/shared';
import { ChatType as PrismaChatType, prisma } from '@infrastructure/shared/persistence/prisma/repo';

interface IChatDao {
  listChat(user_id: string | null): Promise<Chat[]>;
  getChat(id: string): Promise<Chat | null>;
  createOrReplaceChat(chat: Chat): Promise<Chat>;
}
class ChatDao implements IChatDao {
  async listChat(): Promise<Chat[]> {
    try {
      const result = await prisma.chat.findMany({
        // where: {}
      });
      return result.map(r => new Chat(ChatType[PrismaChatType[r.chatType]], r.name, r.avatar, r.id));
    } catch (error) {
      LOGGER.error(error);
      throw new PersistenceError();
    }
  }

  async getChat(id: string): Promise<Chat | null> {
    try {
      // const allResult = await prisma.chat.findFirst({
      //   where: {
      //     id: '63c25006b0aeef5170a1a143'
      //   }
      // });
      // const allResult = await prisma.chat.findMany();
      // console.log(JSON.stringify(allResult));
      const result = await prisma.chat.findUnique({ where: { id } });
      if (!result) {
        return null;
      }
      return new Chat(ChatType[PrismaChatType[result.chatType]], result.name, result.avatar, result.id);
    } catch (error) {
      LOGGER.error(error);
      throw new PersistenceError();
    }
  }

  async createOrReplaceChat(chat: Chat): Promise<Chat> {
    try {
      const response = await prisma.chat.create({ data: chat });
      chat.id = response.id;
      return chat;
    } catch (error) {
      LOGGER.error(error);
      throw new PersistenceError();
    }
  }
}

export { ChatDao, IChatDao };
