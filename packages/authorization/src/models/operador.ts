import { z } from 'zod'

export const operadorSchema = z.object({
  __typename: z.literal('Operador').default('Operador'),
  id: z.string(),
})

export type Operador = z.infer<typeof operadorSchema>
