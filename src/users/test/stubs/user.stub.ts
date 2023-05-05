import { UserType } from '../../schemas/user.schema';
import { Types } from 'mongoose';

export const userStub = (): UserType => {
  return {
    _id: new Types.ObjectId('5f9d4a3d9d6c2c1f1c9d4408'),
    userId: '077959d4-3cbf-458a-ad61-742cbb3b7b99',
    email: 'michael.lawson@reqres.in',
    name: 'Michael Lawson',
    password: '$2b$10$isaOSpX9mUZ7PKi0SThkSujtUqrk4iaNh9zfiyZz2ocEOTj2QlGKW',
  };
};
