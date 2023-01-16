import { plainToClass } from 'class-transformer';

import { Chat } from '@domain/chat/chat';
import { ChatType } from '@domain/chat/chat-type';

const DEFAULT_AVATAR = 'https://avatars.githubusercontent.com/u/34176962?s=200&v=4';
const chatJson = {
  chatType: ChatType.Group,
  name: 'JacobGroup',
  avatar: DEFAULT_AVATAR
};
const chatResultJson = {
  ...chatJson
};
const chat = new Chat(ChatType.Group, 'JacobGroup', DEFAULT_AVATAR);

describe('Testing Chat generation', () => {
  it('should return a valid Chat from json data', () => {
    return expect(plainToClass(Chat, chatJson)).toEqual(chat);
  });
});
describe('Testing Chat parsing', () => {
  it('should return valid json data from a Chat', () => {
    return expect(chat.toJson()).toEqual(chatResultJson);
  });
});
