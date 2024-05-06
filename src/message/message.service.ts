import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Conversation } from './entities/conversation.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './entities/message.entity';
import { Server } from 'socket.io';

@Injectable()
export class MessageService {
  private userSocketMap: { [key: string]: string } = {};

  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,

    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
  ) {}

  async create(
    senderId: string,
    receiverId: string,
    createMessageDto: CreateMessageDto,
    server: Server,
  ) {
    let conversation = await this.conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await this.conversationModel.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await this.messageModel.create({
      senderId,
      receiverId,
      message: createMessageDto.message,
    });

    conversation.messages.push(newMessage);
    await conversation.save();

    if (this.userSocketMap[receiverId]) {
      server.to(this.userSocketMap[receiverId]).emit('newMessage', newMessage);
    }

    return newMessage;
  }

  async findAll(senderId: string, receiverId: string) {
    const conversation = await this.conversationModel
      .findOne({
        participants: { $all: [senderId, receiverId] },
      })
      .populate('messages');

    if (!conversation) {
      return [];
    }

    return conversation.messages;
  }

  userConnected(userId: string, socketId: string, server: Server) {
    this.userSocketMap[userId] = socketId;
    server.emit('getOnlineUsers', Object.keys(this.userSocketMap));
  }

  userDisconnected(userId: string, server: Server) {
    delete this.userSocketMap[userId];
    server.emit('getOnlineUsers', Object.keys(this.userSocketMap));
  }
}
