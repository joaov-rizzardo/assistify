export type FileStorageOptions = {
  mimetype: string;
  originalName?: string;
  expirationMs?: number;
};

export type FileStorageResult = {
  key: string;
  content: Buffer;
  originalName: string;
  filename: string;
  mimetype: string;
};

export abstract class FileStorage {
  abstract store(
    file: string | Buffer,
    options?: FileStorageOptions,
  ): Promise<FileStorageResult>;
  abstract get(key: string): Promise<FileStorageResult | null>;
  abstract delete(key: string): Promise<boolean>;
}
