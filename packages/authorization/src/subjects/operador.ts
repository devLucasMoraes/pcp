import { z } from 'zod'

import { operadorSchema } from '../models/operador'

export const operadorSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('update'),
    z.literal('disable'),
    z.literal('create'),
  ]),
  z.union([z.literal('Operador'), operadorSchema]),
])

export type OperadorSubject = z.infer<typeof operadorSubject>
