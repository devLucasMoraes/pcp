import { z } from 'zod'

export const ordemProducaoSchema = z.object({
  __typename: z.literal('OrdemProducao').default('OrdemProducao'),
  id: z.string(),
})

export type OrdemProducao = z.infer<typeof ordemProducaoSchema>
