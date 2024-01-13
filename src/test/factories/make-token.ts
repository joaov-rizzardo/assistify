import { v4 as uuid } from 'uuid';
import * as jwt from 'jsonwebtoken';

export function makeToken() {
  return jwt.sign({}, 'FAKE_SECRET', {
    subject: uuid(),
    expiresIn: '7d',
  });
}
