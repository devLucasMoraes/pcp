import { z } from 'zod'

export const rotinaSchema = z.object({
  __typename: z.literal('Rotina').default('Rotina'),
  id: z.string(),
})

export type Rotina = z.infer<typeof rotinaSchema>
