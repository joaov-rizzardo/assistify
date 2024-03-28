import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
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
import { UserAuthenticationGuard } from 'src/infra/guards/user-authentication.guard';

@ApiTags('Storage')
@Controller('storage')
export class UploadFileController {
  constructor(private readonly fileStorage: FileStorage) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseGuards(UserAuthenticationGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'Arquivo a ser enviado',
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
