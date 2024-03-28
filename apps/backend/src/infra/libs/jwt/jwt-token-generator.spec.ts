import { JwtTokenGenerator } from './jwt-token-generator';
import { v4 as uuid } from 'uuid';

describe('Jwt Token Generator', () => {
  let sut: JwtTokenGenerator;

  beforeEach(async () => {
    sut = new JwtTokenGenerator();
  });

  it('should generate access token', async () => {
    const accessToken = await sut.generateAccessToken(uuid());
    expect(typeof accessToken).toBe('string');
    expect(accessToken.length).toBeGreaterThan(0);
  });

  it('should generate refresh token', async () => {
    const refreshToken = await sut.generateRefreshToken(uuid());
    expect(typeof refreshToken).toBe('string');
    expect(refreshToken.length).toBeGreaterThan(0);
  });
});
