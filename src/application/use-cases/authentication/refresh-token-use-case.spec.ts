import { TokenGenerator } from 'src/application/core/interfaces/tokens/token-generator';
import { RefreshTokenUseCase } from './refresh-token-use-case';
import { JwtTokenGenerator } from 'src/infra/libs/jwt/jwt-token-generator';
import { v4 as uuid } from 'uuid';
import { makeToken } from 'src/test/factories/make-token';

describe('Refresh token use case', () => {
  let tokenGenerator: TokenGenerator;
  let sut: RefreshTokenUseCase;
  let refreshToken: string;

  beforeEach(async () => {
    tokenGenerator = new JwtTokenGenerator();
    refreshToken = await tokenGenerator.generateRefreshToken(uuid());
    sut = new RefreshTokenUseCase(tokenGenerator);
  });

  it('should generate new access token', async () => {
    const result = await sut.execute({ refreshToken });
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      const { accessToken } = result.value;
      expect(typeof accessToken).toBe('string');
      expect(accessToken.length).toBeGreaterThan(0);
    }
  });

  it('should not generate new access token', async () => {
    const result = await sut.execute({ refreshToken: makeToken() });
    expect(result.isLeft()).toBe(true);
  });
});
