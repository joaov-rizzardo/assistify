import { PipeTransform, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Schema } from 'zod';
import { Socket } from 'socket.io';

@Injectable()
export class WsZodValidationPipe implements PipeTransform {
  constructor(private schema: Schema) {}

  transform(value: unknown) {
    try {
      if (value instanceof Socket) return value;
      this.schema.parse(value);
      return value;
    } catch (error) {
      console.log(error);
      throw new WsException({
        code: 'VALIDATION_FAILED',
        message: 'Payload validation failed, check if it is valid'
      });
    }
  }
}
