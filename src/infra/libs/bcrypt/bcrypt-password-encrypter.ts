import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { PasswordEncrypter } from 'src/application/core/interfaces/cryptography/password-encrypter';

@Injectable()
export class BcryptPasswordEncrypter implements PasswordEncrypter {
  async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  async checkPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
