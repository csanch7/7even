import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BlockedPairDocument = HydratedDocument<BlockedPair>;

@Schema({ timestamps: true, collection: 'blocked_pairs' })
export class BlockedPair {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  blockerId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  blockedId!: Types.ObjectId;

  @Prop({ required: true })
  source!: 'manual_block' | 'moderation_action';
}

export const BlockedPairSchema = SchemaFactory.createForClass(BlockedPair);
BlockedPairSchema.index({ blockerId: 1, blockedId: 1 }, { unique: true });
