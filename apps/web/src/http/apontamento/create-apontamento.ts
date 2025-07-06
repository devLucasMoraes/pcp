import { z } from 'zod'

import { api } from '../api/axios'

export const createApontamentoSchema = z.object({
  dataIncio: z.date(),
  dataFim: z.date(),
  ocorrenciaId: z.string().uuid(),
  operadorId: z.string().uuid(),
  equipamentoId: z.string().uuid(),
  ordemProducaoId: z.string().uuid(),
})

export type CreateApontamentoDTO = z.infer<typeof createApontamentoSchema>

export interface CreateApontamentoResponse {
  apontamentoId: string
}

export async function createApontamento(
  orgSlug: string,
  dto: CreateApontamentoDTO,
) {
  const result = await api.post<CreateApontamentoResponse>(
    `/organizations/${orgSlug}/apontamentos`,
    dto,
  )

  return result.data
}
