import { Injectable } from '@nestjs/common';
import { File } from 'src/application/core/entities/file';
import { CreateFileArgs, FileStorageRepository } from 'src/application/core/interfaces/repositories/file-storage-repository';
import { PrismaProvider } from '../prisma-provider';
import { Prisma } from '@assistify/prisma';

type FileStoragePrismaResponse = Prisma.FileStorageGetPayload<Record<string, never>>;

@Injectable()
export class PrismaFileStorageRepository implements FileStorageRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async create(args: CreateFileArgs): Promise<File> {
    const result = await this.prisma.client.fileStorage.create({
      data: {
        id: args.key,
        filename: args.filename,
        mimetype: args.mimetype,
        original_name: args.originalName,
        expiration: args.expiration
      }
    });
    return this.instanceWithPrismaResponse(result);
  }
  async findById(key: string): Promise<File | null> {
    const result = await this.prisma.client.fileStorage.findUnique({
      where: {
        id: key
      }
    });
    if (!result) return null;
    return this.instanceWithPrismaResponse(result);
  }

  async findAll(): Promise<File[]> {
    const result = await this.prisma.client.fileStorage.findMany();
    return result.map((item) => this.instanceWithPrismaResponse(item));
  }
  async findExpiredFiles(): Promise<File[]> {
    const result = await this.prisma.client.fileStorage.findMany({
      where: {
        expiration: {
          lt: new Date()
        }
      }
    });
    return result.map((item) => this.instanceWithPrismaResponse(item));
  }
  async delete(key: string): Promise<boolean> {
    const result = await this.prisma.client.fileStorage.delete({
      where: {
        id: key
      }
    });
    return !!result;
  }

  private instanceWithPrismaResponse(response: FileStoragePrismaResponse) {
    return new File({
      id: response.id,
      filename: response.filename,
      mimetype: response.mimetype,
      originalName: response.original_name,
      expiration: response.expiration,
      createdAt: response.created_at,
      updatedAt: response.updated_at
    });
  }
}
