import { z } from 'zod'

import { equipamentoSchema } from '../models/equipamento'

export const equipamentoSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('update'),
    z.literal('disable'),
    z.literal('create'),
  ]),
  z.union([z.literal('Equipamento'), equipamentoSchema]),
])

export type EquipamentoSubject = z.infer<typeof equipamentoSubject>
