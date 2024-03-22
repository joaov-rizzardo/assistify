import { File } from 'src/application/core/entities/file';
import {
  CreateFileArgs,
  FileStorageRepository,
} from 'src/application/core/interfaces/repositories/file-storage-repository';

export class InMemoryFileStorageRepository implements FileStorageRepository {
  storage: File[] = [];

  create(args: CreateFileArgs): File {
    const file = new File({
      id: args.key,
      filename: args.filename,
      mimetype: args.mimetype,
      originalName: args.originalName,
      expiration: args.expiration,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.storage.push(file);
    return file;
  }
  findById(key: string): File | null {
    const file = this.storage.find((item) => item.getId() === key);
    return file || null;
  }
  findAll(): File[] | Promise<File[]> {
    return this.storage;
  }
  findExpiredFiles(): File[] | Promise<File[]> {
    return this.storage.filter((item) => item.getExpiration() < new Date());
  }
  delete(key: string): boolean {
    this.storage = this.storage.filter((item) => item.getId() !== key);
    return true;
  }
}
