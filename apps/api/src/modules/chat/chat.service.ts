import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import { Match, MatchDocument } from '../matching/schemas/match.schema';
import { ModerationService } from '../moderation/moderation.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel(Match.name)
    private readonly matchModel: Model<MatchDocument>,
    private readonly moderationService: ModerationService,
    private readonly notificationsService: NotificationsService
  ) {}

  async listMessages(matchId: string, userId: string, pagination: CursorPaginationDto) {
    await this.assertActiveMatchAccess(matchId, userId);

    const query: Record<string, unknown> = {
      matchId: new Types.ObjectId(matchId)
    };

    if (pagination.cursor) {
      query._id = { $lt: new Types.ObjectId(pagination.cursor) };
    }

    const messages = await this.messageModel
      .find(query)
      .sort({ _id: -1 })
      .limit(50);

    return {
      items: messages,
      nextCursor: messages.length > 0 ? messages[messages.length - 1].id : null
    };
  }

  async sendMessage(matchId: string, senderId: string, dto: SendMessageDto) {
    const match = await this.assertActiveMatchAccess(matchId, senderId);

    const moderation = this.moderationService.scanMessage(dto.body);

    const message = await this.messageModel.create({
      matchId: new Types.ObjectId(matchId),
      senderId: new Types.ObjectId(senderId),
      body: dto.body,
      delivered: false,
      read: false,
      flagged: moderation.flagged,
      flagReason: moderation.reason
    });

    const recipientId =
      match.userA.toString() === senderId ? match.userB.toString() : match.userA.toString();

    await this.notificationsService.emitNewMessage(recipientId, matchId, message.id);

    return message;
  }

  async markRead(matchId: string, userId: string, messageId: string) {
    await this.assertActiveMatchAccess(matchId, userId);

    const updated = await this.messageModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(messageId),
        matchId: new Types.ObjectId(matchId)
      },
      { read: true, delivered: true },
      { new: true }
    );

    if (!updated) {
      throw new NotFoundException('Message not found.');
    }

    return updated;
  }

  private async assertActiveMatchAccess(matchId: string, userId: string) {
    const match = await this.matchModel.findOne({
      _id: new Types.ObjectId(matchId),
      status: 'active'
    });

    if (!match) {
      throw new NotFoundException('Active match not found.');
    }

    const participant = [match.userA.toString(), match.userB.toString()];
    if (!participant.includes(userId)) {
      throw new UnauthorizedException('You are not part of this match.');
    }

    if (match.expiresAt < new Date()) {
      throw new ForbiddenException('Match has expired.');
    }

    return match;
  }
}
