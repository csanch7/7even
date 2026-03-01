import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ModerationReportDocument = HydratedDocument<ModerationReport>;

@Schema({ timestamps: true, collection: 'moderation_reports' })
export class ModerationReport {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  matchId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  reporterId!: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], default: [] })
  messageIds!: Types.ObjectId[];

  @Prop({ required: true, default: 'under_review', enum: ['under_review', 'dismissed', 'actioned'] })
  status!: 'under_review' | 'dismissed' | 'actioned';
}

export const ModerationReportSchema = SchemaFactory.createForClass(ModerationReport);
