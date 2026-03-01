import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service';
import {
  NotificationLog,
  NotificationLogSchema
} from './schemas/notification-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NotificationLog.name, schema: NotificationLogSchema }
    ])
  ],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}
