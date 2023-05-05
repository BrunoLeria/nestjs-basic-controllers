import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../users.repository';
import { UserModel } from './support/user.model';
import {
  Connection,
  FilterQuery,
  QueryOptions,
  ProjectionType,
} from 'mongoose';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { UserType } from '../schemas/user.schema';
import { userStub } from './stubs/user.stub';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  describe('find operations', () => {
    let model: UserModel;

    let filterQuery: FilterQuery<UserType>;
    let queryOptions: QueryOptions<UserType>;
    let projectionType: ProjectionType<UserType>;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UsersRepository,
          {
            provide: getModelToken(UserType.name),
            useClass: UserModel,
          },
          { provide: getConnectionToken(), useClass: Connection },
        ],
      }).compile();

      repository = module.get<UsersRepository>(UsersRepository);
      model = module.get<UserModel>(getModelToken(UserType.name));
      filterQuery = { userId: userStub().userId };
      queryOptions = { lean: true };
      projectionType = { __v: 0 };

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
        let users: UserType[];

        beforeEach(async () => {
          jest.spyOn(model, 'find');

          users = await repository.find(filterQuery);
        });

        test('then it should call model', () => {
          expect(model.find).toBeCalledWith(
            filterQuery,
            projectionType,
            queryOptions,
          );
        });

        test('then it should return a list of users', () => {
          expect(users).toEqual([userStub()]);
        });
      });
    });

    describe('findOne', () => {
      describe('when findOne is called', () => {
        let user: UserType;

        beforeEach(async () => {
          jest.spyOn(model, 'findOne');

          user = await repository.findOne(filterQuery);
        });

        test('then it should call model', () => {
          expect(model.findOne).toBeCalledWith(
            filterQuery,
            projectionType,
            queryOptions,
          );
        });

        test('then it should return a user', () => {
          expect(user).toEqual(userStub());
        });
      });
    });

    describe('findOneAndUpdate', () => {
      describe('when findOneAndUpdate is called', () => {
        let user: UserType;

        beforeEach(async () => {
          jest.spyOn(model, 'findOneAndUpdate');

          user = await repository.findOneAndUpdate(filterQuery, userStub());
        });

        test('then it should call model', () => {
          expect(model.findOneAndUpdate).toBeCalledWith(
            filterQuery,
            userStub(),
            {
              new: true,
              ...queryOptions,
            },
          );
        });

        test('then it should return a user', () => {
          expect(user).toEqual(userStub());
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

        test('then it should return the number of deleted users', () => {
          expect(result).toEqual({ deletedCount: 1 });
        });
      });
    });
  });

  describe('create operatios', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UsersRepository,
          {
            provide: getModelToken(UserType.name),
            useValue: UserModel,
          },
          { provide: getConnectionToken(), useValue: Connection },
        ],
      }).compile();

      repository = module.get<UsersRepository>(UsersRepository);

      jest.clearAllMocks();
    });

    describe('create', () => {
      describe('when create is called', () => {
        let user: UserType;
        let saveSpy: jest.SpyInstance;
        let constructorSpy: jest.SpyInstance;

        beforeEach(async () => {
          saveSpy = jest.spyOn(UserModel.prototype, 'save');
          constructorSpy = jest.spyOn(UserModel.prototype, 'constructorSpy');

          user = await repository.create(userStub());
        });

        test('then it should call the model save method', () => {
          expect(saveSpy).toBeCalled();
          expect(constructorSpy).toBeCalled();
        });

        test('then it should return a user', () => {
          expect(user).toEqual(
            expect.objectContaining({
              name: userStub().name,
              email: userStub().email,
              userId: userStub().userId,
            }),
          );
        });
      });
    });
  });
});
