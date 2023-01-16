/* eslint-disable no-undef */
// import Mongo from mongodb;

const conn = new Mongo();
const db = conn.getDB(process.env.MONGODB_DATABASE);
db.auth(process.env.MONGODB_USERNAME, process.env.MONGODB_PASSWORD);
rs.initiate({ _id: 'replicasetkey123', members: [{ _id: 0, host: 'localhost:27017' }] });

// db.getSiblingDB('app-db').createCollection('user')
db.createCollection('User');
db.createCollection('Chat');
db.createCollection('Message');
db.User.insertMany([
  {
    password: '123456',
    username: 'admin',
    email: 'jacob1@gradual.com',
    avatar: 'https://avatars.githubusercontent.com/u/1572996?v=4',
    roles: ['User'],
    name: '张杰1'
  },
  {
    password: 'jacob',
    username: 'jacob1',
    email: 'jacob1@gradual.com',
    avatar: 'https://avatars.githubusercontent.com/u/1572996?v=4',
    roles: ['User'],
    name: '张杰1'
  },
  {
    password: 'jacob',
    username: 'jacob2',
    email: 'jacob2@gradual.com',
    avatar: 'https://avatars.githubusercontent.com/u/13090526?s=200&v=4',
    roles: ['User'],
    name: '张杰2'
  },
  {
    password: 'jacob',
    username: 'jacob3',
    email: 'jacob3@gradual.com',
    avatar: 'https://avatars.githubusercontent.com/u/34176962?s=200&v=4',
    roles: ['User'],
    name: '张杰3'
  }
]);
db.Chat.insertMany([
  {
    chatType: 'Simple',
    name: 'Jacob1&Jacob2',
    avatar: 'https://avatars.githubusercontent.com/u/46467894?s=200&v=4'
  },
  {
    chatType: 'Group',
    name: 'Jacob123Group',
    avatar: 'https://avatars.githubusercontent.com/u/8140227?s=200&v=4'
  }
]);
