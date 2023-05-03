import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { UserType } from '../schemas/user.schema';
import { CreateUserRequest } from '../dto/create-users.request';
import { userStub } from './stubs/user.stub';
import { UpdateUserRequest } from '../dto/update-users.request';

jest.mock('../users.service');

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    describe('when getUsers is called', () => {
      let users: UserType[];

      beforeEach(async () => {
        users = await controller.getUsers();
      });

      test('then it should call usersService', () => {
        expect(service.getUsers).toBeCalled();
      });

      test('then it should return a list of users', () => {
        expect(users).toEqual([userStub()]);
      });
    });
  });

  describe('getUserById', () => {
    describe('when getUserById is called', () => {
      let user: UserType;

      beforeEach(async () => {
        user = await controller.getUserById(userStub().userId);
      });

      test('then it should call usersService', () => {
        expect(service.getUser).toBeCalledWith({ userId: userStub().userId });
      });

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('createUser', () => {
    describe('when createUser is called', () => {
      let user: UserType;
      let createUserRequest: CreateUserRequest;

      beforeEach(async () => {
        createUserRequest = {
          email: userStub().email,
          name: userStub().name,
          password: userStub().password,
        };
        user = await controller.createUser(createUserRequest);
      });

      test('then it should call usersService', () => {
        expect(service.createUser).toBeCalledWith({
          email: userStub().email,
          name: userStub().name,
          password: userStub().password,
        });
      });

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('updateUser', () => {
    describe('when updateUser is called', () => {
      let user: UserType;
      let updateUserRequest: UpdateUserRequest;

      beforeEach(async () => {
        updateUserRequest = {
          email: 'george.edwards@reqres.in',
          name: 'George Edwards',
        };
        user = await controller.updateUser(
          userStub().userId,
          updateUserRequest,
        );
      });

      test('then it should call usersService', () => {
        expect(service.updateUser).toBeCalledWith(
          userStub().userId,
          updateUserRequest,
        );
      });

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('deleteUser', () => {
    describe('when deleteUser is called', () => {
      let result: UserType;

      beforeEach(async () => {
        result = await controller.deleteUser(userStub().userId);
      });

      test('then it should call usersService', () => {
        expect(service.deleteUser).toBeCalledWith(userStub().userId);
      });

      test('then it should return a result', () => {
        expect(result).toEqual({ deletedCount: 1 });
      });
    });
  });
});
