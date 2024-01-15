import {
  HttpLogger,
  LogData,
  LogLevels,
} from 'src/application/core/interfaces/logging/http-logger';
import { HttpLoggerRepository } from './repositories/http-logger-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseHttpLogger implements HttpLogger {
  constructor(private readonly loggerRepository: HttpLoggerRepository) {}
  async log(
    level: LogLevels,
    message: string,
    logData: LogData,
  ): Promise<void> {
    await this.saveLog(level, message, logData);
  }

  async info(message: string, logData: LogData): Promise<void> {
    this.saveLog('info', message, logData);
  }

  async error(message: string, logData: LogData): Promise<void> {
    await this.saveLog('error', message, logData);
  }

  async warn(message: string, logData: LogData): Promise<void> {
    await this.saveLog('warn', message, logData);
  }

  private async saveLog(level: LogLevels, message: string, logData: LogData) {
    await this.loggerRepository.save({
      httpCode: logData.httpCode,
      level,
      message: message,
      route: logData.route,
      userId: logData.userId,
      stack: logData.stack,
      body: logData.body && JSON.stringify(logData.body),
      method: logData.method,
    });
  }
}
