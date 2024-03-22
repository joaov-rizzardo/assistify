import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileStorage } from 'src/application/core/interfaces/storage/file-storage';

@ApiTags('Storage')
@Controller('storage')
export class UploadFileController {
  constructor(private readonly fileStorage: FileStorage) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    required: true,
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.fileStorage.store(file.buffer, {
      mimetype: file.mimetype,
      originalName: file.originalname,
    });
    return {
      code: 'FILE_UPLOADED',
      message: 'File uploaded successfully',
      key: result.key,
    };
  }
}
