import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  NotificationLog,
  NotificationLogDocument
} from './schemas/notification-log.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(NotificationLog.name)
    private readonly notificationLogModel: Model<NotificationLogDocument>
  ) {}

  async emitMatchCreated(userId: string, matchId: string) {
    return this.notificationLogModel.create({
      userId: new Types.ObjectId(userId),
      eventType: 'match_created',
      payload: { matchId },
      delivered: false
    });
  }

  async emitNewMessage(userId: string, matchId: string, messageId: string) {
    return this.notificationLogModel.create({
      userId: new Types.ObjectId(userId),
      eventType: 'new_message',
      payload: { matchId, messageId },
      delivered: false
    });
  }

  async emitMatchExpiring(userId: string, matchId: string) {
    return this.notificationLogModel.create({
      userId: new Types.ObjectId(userId),
      eventType: 'match_expiring',
      payload: { matchId },
      delivered: false
    });
  }
}
