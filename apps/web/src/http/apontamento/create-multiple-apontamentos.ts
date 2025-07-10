import { z } from 'zod'

import { api } from '../api/axios'

const apontamentoSchema = z.object({
  dataInicio: z.string(),
  dataFim: z.string(),
  qtdeApontada: z.coerce.number(),
  ocorrenciaId: z.string().uuid(),
  operadorId: z.string().uuid(),
  equipamentoId: z.string().uuid(),
  ordemProducaoId: z.string().uuid(),
})

export const createMultipleApontamentosSchema = z.object({
  apontamentos: z
    .array(apontamentoSchema)
    .min(1, 'Deve conter pelo menos um apontamento'),
})

export type CreateMultipleApontamentosDTO = z.infer<
  typeof createMultipleApontamentosSchema
>

export type CreateMultipleApontamentosResponse = {
  apontamentos: {
    id: string
  }[]
  totalCreated: number
}

export async function createMultipleApontamentos(
  orgSlug: string,
  dto: CreateMultipleApontamentosDTO,
) {
  const { data } = await api.post<CreateMultipleApontamentosResponse>(
    `/organizations/${orgSlug}/apontamentos/bulk`,
    dto,
  )
  return data
}
