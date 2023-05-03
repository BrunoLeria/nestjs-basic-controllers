import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';
import { userStub } from './stubs/user.stub';
import { UserType } from '../schemas/user.schema';
import { UpdateUserRequest } from '../dto/update-users.request';
import { CreateUserRequest } from '../dto/create-users.request';

jest.mock('../users.repository');

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [UsersService, UsersRepository],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    describe('when getUsers is called', () => {
      let users: UserType[];

      beforeEach(async () => {
        users = await service.getUsers();
      });

      test('then it should call usersRepository', () => {
        expect(repository.find).toBeCalled();
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
        user = await service.getUser({ userId: userStub().userId });
      });

      test('then it should call usersRepository', () => {
        expect(repository.findOne).toBeCalled();
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
          name: 'test',
          email: 'test@email.com',
        };

        user = await service.updateUser(userStub().userId, updateUserRequest);
      });

      test('then it should call usersRepository', () => {
        expect(repository.findOneAndUpdate).toBeCalled();
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
          email: 'george.edwards@reqres.in',
          name: 'George Edwards',
          password: '123456',
        };
        user = await service.createUser(createUserRequest);
      });

      test('then it should call usersRepository', () => {
        expect(repository.create).toBeCalled();
      });

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });
});
