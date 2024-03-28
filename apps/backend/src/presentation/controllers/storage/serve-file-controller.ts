import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { FileStorage } from 'src/application/core/interfaces/storage/file-storage';

@ApiTags('Storage')
@Controller('storage')
export class ServeFileController {
  constructor(private readonly fileStorage: FileStorage) {}

  @ApiParam({ name: 'key', description: 'Key of the file' })
  @Get(':key')
  @ApiResponse({ status: 200, description: 'File retrieved successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async serveFile(@Param('key') key: string, @Res() res: Response) {
    const file = await this.fileStorage.get(key);
    if (!file) {
      throw new NotFoundException({
        code: 'FILE_NOT_FOUND',
        message: 'File not found',
      });
    }
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${file.originalName}"`,
    );
    res.setHeader('Content-Type', file.mimetype);
    res.send(file.content);
  }
}
