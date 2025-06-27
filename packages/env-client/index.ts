import { z } from 'zod'

const clientEnvSchema = z.object({
  VITE_URL_BASE_API: z.string().url(),
  VITE_SOCKET_URL: z.string().url(),
})

export type ClientEnv = z.infer<typeof clientEnvSchema>

// No Vite, as variáveis estão em import.meta.env
export const env = clientEnvSchema.parse(import.meta.env)
