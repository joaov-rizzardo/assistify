import { UseCaseError } from 'src/application/errors/use-case-error';

export class AuthenticationBadCredentialsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Bad credentials`);
  }
}
