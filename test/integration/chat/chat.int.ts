import { ChatCreateUseCase, CreateChatResponse } from '@application/chat';
import { Chat } from '@domain/chat/chat';
import { ChatType } from '@domain/chat/chat-type';
import { ChatDao } from '@test/integration/chat/dao/chat.dao';

describe('Testing create chat use case', () => {
  it('should return not null chat object', () => {
    const chat = new Chat(ChatType.Simple, 'chat1', 'https://avatars.githubusercontent.com/u/34176962?s=200&v=4');
    const chatCreateUsecase = new ChatCreateUseCase(new ChatDao());
    return expect(chatCreateUsecase.execute(chat)).resolves.toEqual(
      new CreateChatResponse(
        'id1',
        ChatType.Simple,
        'chat1',
        'https://avatars.githubusercontent.com/u/34176962?s=200&v=4'
      )
    );
  });
});
