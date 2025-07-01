import { z } from 'zod'

import { apontamentoSchema } from '../models/apontamento'

export const apontamentoSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('update'),
    z.literal('disable'),
    z.literal('create'),
  ]),
  z.union([z.literal('Apontamento'), apontamentoSchema]),
])

export type ApontamentoSubject = z.infer<typeof apontamentoSubject>
