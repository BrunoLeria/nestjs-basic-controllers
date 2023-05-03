import { MockModel } from '../../../database/support/mock.model';
import { UserType } from '../../schemas/user.schema';
import { userStub } from '../stubs/user.stub';

export class UserModel extends MockModel<UserType> {
  protected abstractStub: UserType = userStub();
}
