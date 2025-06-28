import { z } from 'zod'

export const ocorrenciaSchema = z.object({
  __typename: z.literal('Ocorrencia').default('Ocorrencia'),
  id: z.string(),
})

export type Ocorrencia = z.infer<typeof ocorrenciaSchema>
