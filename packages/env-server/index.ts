import path from 'node:path'

import dotenv from 'dotenv'
import { z } from 'zod'

// Carrega o .env da raiz do projeto
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

const serverEnvSchema = z.object({
  // Server
  SERVER_PORT: z.coerce.number().default(3333),

  // Database
  DATABASE_URL: z.string().url(),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().default('docker'),
  DB_PASSWORD: z.string().default('docker'),
  DB_DATABASE: z.string().default('pcp'),

  FRONTEND_URL: z.string().url(),

  // Secrets
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  COOKIE_SECRET: z.string().min(1, 'COOKIE_SECRET is required'),

  // OAuth (opcionais)
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GITHUB_REDIRECT_URI: z.string().url().optional(),

  // Node environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

export const env = serverEnvSchema.parse(process.env)
