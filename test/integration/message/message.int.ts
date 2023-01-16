import { CreateMessageResponse, MessageCreateUseCase } from '@application/message';
import { Message } from '@domain/message/message';
import { MessageType } from '@domain/message/message-type';
import { MessageDao } from '@test/integration/message/dao/message.dao';

describe('Testing create message use case', () => {
  it('should return not null message object', () => {
    const message: any = new Message(
      '1',
      'jacob1',
      MessageType.Text,
      'Hello World',
      'Hello',
      '1',
      ['Jacob1', 'Jacob2'],
      ['1', '2']
    );
    const messageCreateUsecase = new MessageCreateUseCase(new MessageDao());
    const result = new CreateMessageResponse(
      'id1',
      '1',
      'jacob1',
      MessageType.Text,
      'Hello World',
      'Hello',
      '1',
      ['Jacob1', 'Jacob2'],
      ['1', '2'],
      new Date()
    ).toJson();
    delete result.createdAt;
    return expect(messageCreateUsecase.execute(message)).resolves.toEqual(expect.objectContaining(result));
  });
});
