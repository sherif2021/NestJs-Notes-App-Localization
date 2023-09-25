import { Document } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema({
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      delete ret._id;
      delete ret.updatedAt;
    },
  },
  toObject: {
    virtuals: true,
    transform(doc, ret) {
      doc.id = ret._id;
    },
  },
  versionKey: false,
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  picture: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
