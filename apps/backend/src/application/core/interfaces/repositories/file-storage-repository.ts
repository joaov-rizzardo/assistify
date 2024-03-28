import { File } from '../../entities/file';

export type StorageType = 'file_system';

export type CreateFileArgs = {
  key: string;
  filename: string;
  originalName: string;
  mimetype: string;
  expiration: Date;
  storageType: StorageType;
};

export abstract class FileStorageRepository {
  abstract create(args: CreateFileArgs): Promise<File> | File;
  abstract findById(key: string): Promise<File | null> | File | null;
  abstract findAll(): Promise<File[]> | File[];
  abstract findExpiredFiles(): Promise<File[]> | File[];
  abstract delete(key: string): Promise<boolean> | boolean;
}
