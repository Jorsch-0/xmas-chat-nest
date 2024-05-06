import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('connection')
  handleConnection(client: Socket) {
    console.log('New client connected', client.id);

    const userId = client.handshake.query.userId;
    if (userId !== undefined && typeof userId !== 'object')
      this.messageService.userConnected(userId, client.id, this.server);

    client.on('disconnect', () => {
      console.log('Client disconnected', client.id);
      if (userId !== undefined && typeof userId !== 'object')
        this.messageService.userDisconnected(userId, this.server);
    });
  }
}
