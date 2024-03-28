import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';
import { UploadFileController } from 'src/presentation/controllers/storage/upload-file-controller';
import { FileStorage } from 'src/application/core/interfaces/storage/file-storage';
import { FsFileStorage } from '../common/storage/fs-file-storage';
import { ServeFileController } from 'src/presentation/controllers/storage/serve-file-controller';

@Module({
  imports: [PrismaModule],
  controllers: [UploadFileController, ServeFileController],
  providers: [
    {
      provide: FileStorage,
      useClass: FsFileStorage
    }
  ],
  exports: [FileStorage]
})
export class StorageModule {}
