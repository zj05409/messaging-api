import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
prisma.$connect();

export { prisma };

export { Chat, ChatType, Message, MessageType, Role, User } from '@prisma/client';
