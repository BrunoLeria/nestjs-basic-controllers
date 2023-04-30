import { AbstractDocument } from '../../database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class PostType extends AbstractDocument {
  @Prop()
  postId: string;

  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  phoneNumber: string;
}

export const PostSchema = SchemaFactory.createForClass(PostType);
