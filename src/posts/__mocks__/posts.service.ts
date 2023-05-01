import { postStub } from '../test/stubs/post.stub';

export const PostsService = jest.fn().mockReturnValue({
  getPostById: jest.fn().mockResolvedValue(postStub()),
  getPosts: jest.fn().mockResolvedValue([postStub()]),
  createPost: jest.fn().mockResolvedValue(postStub()),
  updatePost: jest.fn().mockResolvedValue(postStub()),
  deletePost: jest.fn().mockResolvedValue({ deletedCount: 1 }),
});
