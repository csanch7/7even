import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AuthSessionDocument = HydratedDocument<AuthSession>;

@Schema({ timestamps: true, collection: 'auth_sessions' })
export class AuthSession {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, index: true })
  tokenFamily!: string;

  @Prop({ required: true, index: true })
  tokenHash!: string;

  @Prop({ required: true })
  expiresAt!: Date;

  @Prop({ default: false, index: true })
  revoked!: boolean;

  @Prop()
  revokedAt?: Date;
}

export const AuthSessionSchema = SchemaFactory.createForClass(AuthSession);
AuthSessionSchema.index({ userId: 1, tokenFamily: 1 });
