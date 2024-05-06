import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageGateway } from './message.gateway';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly messageGateway: MessageGateway,
  ) {}

  @Post('send/:receiverId')
  @UseGuards(AuthGuard)
  create(
    @Param('receiverId') id: string,
    @Body() createMessageDto: CreateMessageDto,
    @Request() req,
  ) {
    const { userId } = req.user;

    return this.messageService.create(
      userId,
      id,
      createMessageDto,
      this.messageGateway.server,
    );
  }

  @Get(':receiverId')
  @UseGuards(AuthGuard)
  findAll(@Param('receiverId') id: string, @Request() req) {
    const { userId } = req.user;

    return this.messageService.findAll(userId, id);
  }
}
