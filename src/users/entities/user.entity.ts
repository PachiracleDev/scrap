import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User extends Document {
  @Prop({ unique: true })
  readonly email: string;

  @Prop()
  password: string;

  @Prop({ default: 'user', enum: ['user', 'admin'], required: false })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
