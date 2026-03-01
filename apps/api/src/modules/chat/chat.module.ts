import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from '../matching/schemas/match.schema';
import { ModerationModule } from '../moderation/moderation.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message, MessageSchema } from './schemas/message.schema';

@Module({
  imports: [
    JwtModule.register({}),
    ModerationModule,
    NotificationsModule,
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Match.name, schema: MatchSchema }
    ])
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
  exports: [ChatService]
})
export class ChatModule {}
