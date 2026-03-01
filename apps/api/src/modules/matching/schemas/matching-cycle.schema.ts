import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MatchingCycleDocument = HydratedDocument<MatchingCycle>;

@Schema({ timestamps: true, collection: 'matching_cycles' })
export class MatchingCycle {
  @Prop({ required: true, unique: true, index: true })
  cycleKey!: string;

  @Prop({ required: true })
  startedAt!: Date;

  @Prop()
  completedAt?: Date;

  @Prop({ default: 'running', enum: ['running', 'completed', 'failed'] })
  status!: 'running' | 'completed' | 'failed';

  @Prop({ default: 0 })
  candidateCount!: number;

  @Prop({ default: 0 })
  matchedCount!: number;
}

export const MatchingCycleSchema = SchemaFactory.createForClass(MatchingCycle);
