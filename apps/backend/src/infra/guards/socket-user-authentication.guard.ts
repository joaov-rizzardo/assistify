import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Request } from 'express';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { TokenGenerator } from 'src/application/core/interfaces/tokens/token-generator';

export interface UserRequest extends Request {
  userId: string;
}

@Injectable()
export class SocketUserAuthenticationGuard implements CanActivate {
  constructor(
    private readonly tokenGenerator: TokenGenerator,
    private readonly userRepository: UserRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('Chegou aqui');
    const requestData = context.switchToWs().getData();
    const token = requestData.authorization;
    const UNAUTHORIZED_CODE = 'UNAUTHORIZED_USER_ACCESS';
    if (!token) {
      throw new WsException({
        message: 'Token was not provided',
        code: UNAUTHORIZED_CODE
      });
    }
    if ((await this.tokenGenerator.checkAccessToken(token)) === false) {
      throw new WsException({
        message: 'Token is not valid',
        code: UNAUTHORIZED_CODE
      });
    }
    const data = await this.tokenGenerator.decodeAccessToken(token);
    if (!(await this.userRepository.checkIfUserExistsById(data.userId))) {
      throw new WsException({
        message: 'User not exists',
        code: UNAUTHORIZED_CODE
      });
    }
    delete requestData.authorization;
    requestData.userId = data.userId;
    return true;
  }
}
