import { exit } from 'process';
import { z } from 'zod';
import * as dotenv from 'dotenv';

const DotenvSchema = z.object({
  SERVER_ID: z.string(),
  DATABASE_URL: z.string()
});

type DotenvSchemaType = z.infer<typeof DotenvSchema>;

export class EnvironmentConfigs {
  private static variables: DotenvSchemaType;

  static loadEnvironmentVariables() {
    try {
      dotenv.config({ path: ['.env', '../../.env'] });
      this.variables = DotenvSchema.parse(process.env);
    } catch {
      console.log('Cannot read environment variables, please check if they are valid');
      exit(1);
    }
  }

  static getEnvironmentVariable<T extends keyof DotenvSchemaType>(key: T) {
    return this.variables[key];
  }
}
