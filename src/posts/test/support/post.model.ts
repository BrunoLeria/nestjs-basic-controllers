import { MockModel } from '../../../database/support/mock.model';
import { PostType } from '../../schemas/post.schema';
import { postStub } from '../stubs/post.stub';

export class PostModel extends MockModel<PostType> {
  protected abstractStub: PostType = postStub();
}
