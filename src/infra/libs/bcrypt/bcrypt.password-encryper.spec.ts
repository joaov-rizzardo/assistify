import { BcryptPasswordEncrypter } from './bcrypt-password-encrypter';

describe('BcryptPasswordEncrypter', () => {
  const sut = new BcryptPasswordEncrypter();
  const password = 'Safe_password123@';
  let encryptedPassword: string;

  beforeEach(async () => {
    encryptedPassword = await sut.encryptPassword(password);
  });

  it('should encrypt password', () => {
    expect(encryptedPassword).not.toBe(password);
  });

  it('should check password', async () => {
    expect(await sut.checkPassword(password, encryptedPassword)).toBe(true);
    expect(await sut.checkPassword(password, password)).toBe(false);
  });
});
