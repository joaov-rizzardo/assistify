import { FileStorageRepository } from 'src/application/core/interfaces/repositories/file-storage-repository';
import { FsFileStorage } from './fs-file-storage';
import { InMemoryFileStorageRepository } from 'src/test/repositories/in-memory-file-storage-repository';
import * as fs from 'fs';

describe('File system storage', () => {
  let fileStorageRepository: FileStorageRepository;
  let sut: FsFileStorage;

  beforeEach(() => {
    fileStorageRepository = new InMemoryFileStorageRepository();
    sut = new FsFileStorage(fileStorageRepository);
  });

  it('should store a file', async () => {
    const result = await sut.store(Buffer.from('test'), {
      mimetype: 'text/plain',
      originalName: 'test.txt',
    });
    const filepath = `${sut.FOLDER_PATH}/${result.filename}`;
    expect(fs.existsSync(filepath)).toBe(true);
    expect(await fileStorageRepository.findById(result.key)).toBeTruthy();
    fs.rmSync(filepath);
  });

  it('should store temporary file', async () => {
    const result = await sut.store(Buffer.from('test'), {
      mimetype: 'text/plain',
      originalName: 'test.txt',
      expirationMs: 1000,
    });
    const file = await fileStorageRepository.findById(result.key);
    expect(file.getExpiration()).toBeTruthy();
    fs.rmSync(`${sut.FOLDER_PATH}/${result.filename}`);
  });

  it('should get a file', async () => {
    const result = await sut.store(Buffer.from('test'), {
      mimetype: 'text/plain',
      originalName: 'test.txt',
    });
    const file = await sut.get(result.key);
    expect(file).toBeTruthy();
    fs.rmSync(`${sut.FOLDER_PATH}/${result.filename}`);
  });

  it('should delete a file', async () => {
    const result = await sut.store(Buffer.from('test'), {
      mimetype: 'text/plain',
      originalName: 'test.txt',
    });
    expect(await sut.delete(result.key)).toBe(true);
    expect(await fileStorageRepository.findById(result.key)).toBeNull();
    expect(fs.existsSync(`${sut.FOLDER_PATH}/${result.filename}`)).toBe(false);
  });
});
