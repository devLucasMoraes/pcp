import { z } from 'zod'

import { api } from '../api/axios'

export const createOrdemProducaoSchema = z.object({
  cod: z.string(),
  descricao: z.string(),
  tiragem: z.number(),
  valorServico: z.number(),
  nomeCliente: z.string(),
})

export type CreateOrdemProducaoDTO = z.infer<typeof createOrdemProducaoSchema>

export interface CreateOrdemProducaoResponse {
  ordemProducaoId: string
}

export async function createOrdemProducao(
  orgSlug: string,
  dto: CreateOrdemProducaoDTO,
) {
  const result = await api.post<CreateOrdemProducaoResponse>(
    `/organizations/${orgSlug}/ordens-producao`,
    dto,
  )
  return result.data
}
