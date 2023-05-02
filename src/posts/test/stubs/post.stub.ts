import { PostType } from '../../schemas/post.schema';
import { Types } from 'mongoose';

export const postStub = (): PostType => {
  return {
    _id: new Types.ObjectId('5f9d4a3d9d6c2c1f1c9d4408'),
    postId: '1',
    content:
      'Exercitation id labore nostrud ex et adipisicing voluptate fugiat irure. Adipisicing elit elit amet commodo dolor. Irure pariatur qui consectetur ad nostrud sunt elit. Non sint incididunt sunt ut. Proident ea mollit dolore non irure voluptate occaecat.',
    title: 'Quis quis incididunt commodo et est ea.',
  };
};
