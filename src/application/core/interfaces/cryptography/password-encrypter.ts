export abstract class PasswordEncrypter {
  abstract encryptPassword(password: string): string | Promise<string>;
  abstract checkPassword(
    password: string,
    hashedPassword: string,
  ): boolean | Promise<boolean>;
}
