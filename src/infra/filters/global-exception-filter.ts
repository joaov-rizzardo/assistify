import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { HttpLogger } from 'src/application/core/interfaces/logging/http-logger';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly httpLogger: HttpLogger,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const httpResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    const errorMessage =
      exception instanceof HttpException || exception instanceof Error
        ? exception.message
        : 'Unknown error';

    const errorStack =
      exception instanceof HttpException || exception instanceof Error
        ? exception.stack
        : undefined;

    await this.httpLogger.log(
      this.getErrorLevelByHttpCode(httpStatus),
      errorMessage,
      {
        httpCode: httpStatus,
        route: httpAdapter.getRequestUrl(ctx.getRequest()),
        userId: 'sdasd',
        body: request.body,
        stack: errorStack,
        method: httpAdapter.getRequestMethod(ctx.getRequest()),
      },
    );
    httpAdapter.reply(ctx.getResponse(), httpResponse, httpStatus);
  }

  getErrorLevelByHttpCode(httpCode: number) {
    if (httpCode >= 100 && httpCode <= 399) {
      return 'info';
    }

    if (httpCode >= 400 && httpCode <= 499) {
      return 'warn';
    }

    if (httpCode >= 500 && httpCode <= 599) {
      return 'error';
    }
  }
}
