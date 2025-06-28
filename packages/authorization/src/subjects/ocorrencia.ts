import { z } from 'zod'

import { ocorrenciaSchema } from '../models/ocorrencia'

export const ocorrenciaSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('update'),
    z.literal('disable'),
    z.literal('create'),
  ]),
  z.union([z.literal('Ocorrencia'), ocorrenciaSchema]),
])

export type OcorrenciaSubject = z.infer<typeof ocorrenciaSubject>
