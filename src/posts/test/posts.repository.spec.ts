import { Test, TestingModule } from '@nestjs/testing';
import { PostsRepository } from '../posts.repository';
import { PostModel } from './support/post.model';
import {
  Connection,
  FilterQuery,
  QueryOptions,
  ProjectionType,
} from 'mongoose';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { PostType } from '../schemas/post.schema';
import { postStub } from './stubs/post.stub';

describe('PostsRepository', () => {
  let repository: PostsRepository;
  describe('find operations', () => {
    let model: PostModel;

    let filterQuery: FilterQuery<PostType>;
    let queryOptions: QueryOptions<PostType>;
    let projectionType: ProjectionType<PostType>;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          PostsRepository,
          {
            provide: getModelToken(PostType.name),
            useClass: PostModel,
          },
          { provide: getConnectionToken(), useClass: Connection },
        ],
      }).compile();

      repository = module.get<PostsRepository>(PostsRepository);
      model = module.get<PostModel>(getModelToken(PostType.name));
      filterQuery = { postId: postStub().postId };
      queryOptions = { lean: true };
      projectionType = { _id: 0, __v: 0 };

      jest.clearAllMocks();
    });

    it('should be defined', () => {
      expect(repository).toBeDefined();
    });

    it('model should be defined', () => {
      expect(model).toBeDefined();
    });

    describe('find', () => {
      describe('when find is called', () => {
        let posts: PostType[];

        beforeEach(async () => {
          jest.spyOn(model, 'find');

          posts = await repository.find(filterQuery);
        });

        test('then it should call model', () => {
          expect(model.find).toBeCalledWith(
            filterQuery,
            projectionType,
            queryOptions,
          );
        });

        test('then it should return a list of posts', () => {
          expect(posts).toEqual([postStub()]);
        });
      });
    });

    describe('findOne', () => {
      describe('when findOne is called', () => {
        let post: PostType;

        beforeEach(async () => {
          jest.spyOn(model, 'findOne');

          post = await repository.findOne(filterQuery);
        });

        test('then it should call model', () => {
          expect(model.findOne).toBeCalledWith(
            filterQuery,
            projectionType,
            queryOptions,
          );
        });

        test('then it should return a post', () => {
          expect(post).toEqual(postStub());
        });
      });
    });

    describe('findOneAndUpdate', () => {
      describe('when findOneAndUpdate is called', () => {
        let post: PostType;

        beforeEach(async () => {
          jest.spyOn(model, 'findOneAndUpdate');

          post = await repository.findOneAndUpdate(filterQuery, postStub());
        });

        test('then it should call model', () => {
          expect(model.findOneAndUpdate).toBeCalledWith(
            filterQuery,
            postStub(),
            {
              new: true,
              ...queryOptions,
            },
          );
        });

        test('then it should return a post', () => {
          expect(post).toEqual(postStub());
        });
      });
    });

    describe('findOneAndDelete', () => {
      describe('when findOneAndDelete is called', () => {
        let result: any;

        beforeEach(async () => {
          jest.spyOn(model, 'findOneAndDelete');

          result = await repository.findOneAndDelete(filterQuery);
        });

        test('then it should call model', () => {
          expect(model.findOneAndDelete).toBeCalledWith(filterQuery);
        });

        test('then it should return the number of deleted posts', () => {
          expect(result).toEqual({ deletedCount: 1 });
        });
      });
    });
  });

  describe('create operatios', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          PostsRepository,
          {
            provide: getModelToken(PostType.name),
            useValue: PostModel,
          },
          { provide: getConnectionToken(), useValue: Connection },
        ],
      }).compile();

      repository = module.get<PostsRepository>(PostsRepository);

      jest.clearAllMocks();
    });

    describe('create', () => {
      describe('when create is called', () => {
        let post: PostType;
        let saveSpy: jest.SpyInstance;
        let constructorSpy: jest.SpyInstance;

        beforeEach(async () => {
          saveSpy = jest.spyOn(PostModel.prototype, 'save');
          constructorSpy = jest.spyOn(PostModel.prototype, 'constructorSpy');

          post = await repository.create(postStub());
        });

        test('then it should call the model save method', () => {
          expect(saveSpy).toBeCalled();
          expect(constructorSpy).toBeCalled();
        });

        test('then it should return a post', () => {
          expect(post).toEqual(
            expect.objectContaining({
              content: postStub().content,
              title: postStub().title,
              postId: postStub().postId,
            }),
          );
        });
      });
    });
  });
});
