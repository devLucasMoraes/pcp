import { z } from 'zod'

import { rotinaSchema } from '../models/rotinaTarefas'

export const rotinaSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('update'),
    z.literal('disable'),
    z.literal('create'),
  ]),
  z.union([z.literal('Rotina'), rotinaSchema]),
])

export type RotinaSubject = z.infer<typeof rotinaSubject>
