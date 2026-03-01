import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VenueEventDocument = HydratedDocument<VenueEvent>;

@Schema({ timestamps: true, collection: 'venues_events_catalog' })
export class VenueEvent {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, enum: ['restaurant', 'event'] })
  type!: 'restaurant' | 'event';

  @Prop({ required: true })
  neighborhood!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop()
  address?: string;

  @Prop()
  description?: string;
}

export const VenueEventSchema = SchemaFactory.createForClass(VenueEvent);
VenueEventSchema.index({ tags: 1, type: 1 });
