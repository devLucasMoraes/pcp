import { z } from 'zod'

export const equipamentoSchema = z.object({
  __typename: z.literal('Equipamento').default('Equipamento'),
  id: z.string(),
})

export type Equipamento = z.infer<typeof equipamentoSchema>
