import { postStub } from '../test/stubs/post.stub';

export const PostsRepository = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(postStub()),
  find: jest.fn().mockResolvedValue([postStub()]),
  findOne: jest.fn().mockResolvedValue(postStub()),
  findOneAndUpdate: jest.fn().mockResolvedValue(postStub()),
  findOneAndDelete: jest.fn().mockResolvedValue(postStub()),
  startTransaction: jest.fn().mockResolvedValue({
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
  }),
});
