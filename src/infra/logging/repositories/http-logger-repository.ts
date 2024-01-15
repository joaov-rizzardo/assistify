import { LogLevels } from 'src/application/core/interfaces/logging/http-logger';

export type SaveLogParams = {
  message: string;
  userId?: string;
  body?: string;
  route: string;
  httpCode: number;
  level: LogLevels;
  stack?: string;
  method: string;
};

export abstract class HttpLoggerRepository {
  abstract save(args: SaveLogParams): Promise<void> | void;
}
