import { z } from 'zod'

export const apontamentoSchema = z.object({
  __typename: z.literal('Apontamento').default('Apontamento'),
  id: z.string(),
})

export type Apontamento = z.infer<typeof apontamentoSchema>
