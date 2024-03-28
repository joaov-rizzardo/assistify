import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { UpdateUserUseCase } from './update-user-use-case';
import { User } from 'src/application/core/entities/user';
import { InMemoryUserRepository } from 'src/test/repositories/in-memory-user-repository';
import { makeUser } from 'src/test/factories/make-user';
import { FileStorage, FileStorageResult } from 'src/application/core/interfaces/storage/file-storage';
import { FsFileStorage } from 'src/infra/common/storage/fs-file-storage';
import { FileStorageRepository } from 'src/application/core/interfaces/repositories/file-storage-repository';
import { InMemoryFileStorageRepository } from 'src/test/repositories/in-memory-file-storage-repository';
import { v4 as uuid } from 'uuid';
import { UserNotExistsError } from 'src/application/errors/user-not-exists-error';
import { FileNotExistsError } from 'src/application/errors/file-not-exists-error';
import { ProfilePictureIsNotImageError } from './errors/profile-picture-is-not-image-error';

describe('Update user use case', () => {
  let userRepository: UserRepository;
  let fileStorage: FileStorage;
  let fileStorageRepository: FileStorageRepository;
  let sut: UpdateUserUseCase;
  let user: User;
  let file: FileStorageResult;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    fileStorageRepository = new InMemoryFileStorageRepository();
    fileStorage = new FsFileStorage(fileStorageRepository);
    sut = new UpdateUserUseCase(userRepository, fileStorage);
    user = await userRepository.create(makeUser());
    file = await fileStorage.store(Buffer.from('test'), {
      mimetype: 'image/png',
      originalName: 'test.png'
    });
  });

  it('should update user fields', async () => {
    const { name, lastName } = makeUser();
    const result = await sut.execute(user.getId(), {
      name,
      lastName,
      profilePicture: file.key
    });
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      const updatedUser = result.value;
      expect(updatedUser.getName()).toBe(name);
      expect(updatedUser.getLastName()).toBe(lastName);
      expect(updatedUser.getProfilePicture()).toBe(file.key);
    }
  });

  it('should check if user exists', async () => {
    const result = await sut.execute(uuid(), {});
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      const error = result.value;
      expect(error).toBeInstanceOf(UserNotExistsError);
    }
  });

  it("should check if user's profile picture exists", async () => {
    const result = await sut.execute(user.getId(), {
      profilePicture: uuid()
    });
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      const error = result.value;
      expect(error).toBeInstanceOf(FileNotExistsError);
    }
  });

  it('should check if profile picture is a image', async () => {
    const file = await fileStorage.store(Buffer.from('test'), {
      mimetype: 'text/plain',
      originalName: 'test.txt'
    });
    const result = await sut.execute(user.getId(), {
      profilePicture: file.key
    });
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      const error = result.value;
      expect(error).toBeInstanceOf(ProfilePictureIsNotImageError);
    }
  });
});
