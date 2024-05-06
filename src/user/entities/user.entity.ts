import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ required: true, enum: ['male', 'female'] })
  gender: string;

  @Prop({ default: '' })
  profilePic: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
