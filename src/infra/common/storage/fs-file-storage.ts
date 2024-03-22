import { Injectable } from '@nestjs/common';
import {
  FileStorage,
  FileStorageOptions,
  FileStorageResult,
} from 'src/application/core/interfaces/storage/file-storage';
import * as fs from 'fs';
import * as mime from 'mime-types';
import { v4 as uuid } from 'uuid';
import { FileStorageRepository } from 'src/application/core/interfaces/repositories/file-storage-repository';

@Injectable()
export class FsFileStorage implements FileStorage {
  constructor(private readonly fileStorageRepository: FileStorageRepository) {
    if (!fs.existsSync(this.FOLDER_PATH)) {
      fs.mkdirSync(this.FOLDER_PATH);
    }
  }

  public FOLDER_PATH = './storage';

  async store(
    file: string | Buffer,
    options?: FileStorageOptions,
  ): Promise<FileStorageResult> {
    const fileContent: Buffer =
      typeof file === 'string' ? fs.readFileSync(file) : file;
    const extension = mime.extension(options.mimetype);
    const key = uuid();
    const fileName = `${key}.${extension}`;
    const filePath = `${this.FOLDER_PATH}/${fileName}`;
    fs.writeFileSync(filePath, fileContent);
    await this.fileStorageRepository.create({
      key: key,
      filename: fileName,
      mimetype: options.mimetype,
      originalName: options.originalName || fileName,
      expiration: options.expirationMs
        ? new Date(Date.now() + options.expirationMs)
        : undefined,
      storageType: 'file_system',
    });
    return {
      key,
      originalName: options.originalName || fileName,
      filename: fileName,
      content: fileContent,
      mimetype: options.mimetype,
    };
  }

  async get(key: string): Promise<FileStorageResult> {
    const fileData = await this.fileStorageRepository.findById(key);
    if (!fileData) return null;
    const file = fs.readFileSync(
      `${this.FOLDER_PATH}/${fileData.getFilename()}`,
    );
    if (!file) return null;
    return {
      key: fileData.getId(),
      content: file,
      filename: fileData.getFilename(),
      originalName: fileData.getOriginalName(),
      mimetype: fileData.getMimetype(),
    };
  }

  async delete(key: string): Promise<boolean> {
    const fileData = await this.fileStorageRepository.findById(key);
    if (!fileData) return false;
    if (!(await this.fileStorageRepository.delete(key))) return false;
    fs.rmSync(`${this.FOLDER_PATH}/${fileData.getFilename()}`);
    return true;
  }
}
