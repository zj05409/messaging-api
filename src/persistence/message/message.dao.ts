import { PersistenceError } from '@/persistence/shared/persistence.error';
import { Message } from '@domain/message/message';
import { MessageType } from '@domain/message/message-type';
import { LOGGER } from '@domain/shared';
import { MessageType as PrismaMessageType, prisma } from '@infrastructure/shared/persistence/prisma/repo';

interface IMessageDao {
  listMessage(user_id: string | null, chat_id: string | null): Promise<Message[]>;
  getMessage(id: string): Promise<Message | null>;
  createOrReplaceMessage(message: Message): Promise<Message>;
  deleteMessage(id: string): Promise<void>;
}
class MessageDao implements IMessageDao {
  async listMessage(user_id: string | null, chat_id: string): Promise<Message[]> {
    try {
      let selector: any = {};
      if (user_id) {
        selector = { userId: user_id };
      }
      if (chat_id) {
        selector = { ...selector, chatId: chat_id };
      }
      const result = await prisma.message.findMany({
        where: selector
      });
      return result.map(
        r =>
          new Message(
            r.chatId,
            r.userId,
            MessageType[PrismaMessageType[r.messageType]],
            r.content,
            r.referenceExtract,
            r.referenceMessageId,
            r.ats,
            r.atIds,
            r.id,
            r.createdAt
          )
      );
    } catch (error) {
      LOGGER.error(error);
      throw new PersistenceError();
    }
  }

  async getMessage(id: string): Promise<Message | null> {
    try {
      const result = await prisma.message.findUnique({ where: { id } });
      if (!result) {
        return null;
      }
      return new Message(
        result.chatId,
        result.userId,
        MessageType[PrismaMessageType[result.messageType]],
        result.content,
        result.referenceExtract,
        result.referenceMessageId,
        result.ats,
        result.atIds,
        result.id,
        result.createdAt
      );
    } catch (error) {
      LOGGER.error(error);
      throw new PersistenceError();
    }
  }

  async deleteMessage(id: string): Promise<void> {
    try {
      await prisma.message.delete({ where: { id } });
    } catch (error) {
      LOGGER.error(error);
      throw new PersistenceError();
    }
  }

  async createOrReplaceMessage(message: Message): Promise<Message> {
    try {
      const anyMessage: any = message;
      const response = await prisma.message.create({
        data: anyMessage
      });
      message.id = response.id;
      return message;
    } catch (error) {
      LOGGER.error(error);
      throw new PersistenceError();
    }
  }
}

export { IMessageDao, MessageDao };
