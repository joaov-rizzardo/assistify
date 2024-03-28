import { z } from 'zod';

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string()
});

type EnvType = z.infer<typeof EnvSchema>;

export function getEnvVariable<T extends keyof EnvType>(key: T) {
  const validatedProcessEnv: EnvType = EnvSchema.parse(process.env);
  return validatedProcessEnv[key];
}
