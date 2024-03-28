export type LogData = {
  userId?: string;
  workspaceId?: string;
  body?: Record<string, unknown>;
  stack?: string;
  route: string;
  httpCode: number;
  method: string;
};

export type LogLevels = 'warn' | 'error' | 'info';

export abstract class HttpLogger {
  abstract log(level: LogLevels, message: string, logData: LogData): void | Promise<void>;
  abstract info(message: string, logData: LogData): void | Promise<void>;
  abstract error(message: string, logData: LogData): void | Promise<void>;
  abstract warn(message: string, logData: LogData): void | Promise<void>;
}
