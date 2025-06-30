import { z } from 'zod'

import { ordemProducaoSchema } from '../models/ordemProducao'

export const ordemProducaoSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('update'),
    z.literal('disable'),
    z.literal('create'),
  ]),
  z.union([z.literal('OrdemProducao'), ordemProducaoSchema]),
])

export type OrdemProducaoSubject = z.infer<typeof ordemProducaoSubject>
