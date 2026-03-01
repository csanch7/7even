import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/interfaces/request.interface';
import { ReadMessageDto } from './dto/read-message.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatService } from './chat.service';

@Controller('matches/:matchId/messages')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  listMessages(
    @Param('matchId') matchId: string,
    @CurrentUser() user: AuthUser,
    @Query() pagination: CursorPaginationDto
  ) {
    return this.chatService.listMessages(matchId, user.sub, pagination);
  }

  @Post()
  sendMessage(
    @Param('matchId') matchId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: SendMessageDto
  ) {
    return this.chatService.sendMessage(matchId, user.sub, dto);
  }

  @Post('read')
  markRead(
    @Param('matchId') matchId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: ReadMessageDto
  ) {
    return this.chatService.markRead(matchId, user.sub, dto.messageId);
  }
}
