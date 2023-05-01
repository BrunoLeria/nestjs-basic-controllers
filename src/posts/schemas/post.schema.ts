import { AbstractDocument } from '../../database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class PostType extends AbstractDocument {
  @Prop()
  postId: string;

  @Prop()
  content: string;

  @Prop()
  title: string;
}

export const PostSchema = SchemaFactory.createForClass(PostType);
