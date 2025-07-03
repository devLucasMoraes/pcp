import { z } from 'zod'

import { api } from '../api/axios'

export const updateOrdemProducaoSchema = z.object({
  cod: z.string(),
  descricao: z.string(),
  tiragem: z.number(),
  valorServico: z.number(),
  nomeCliente: z.string(),
})

export type UpdateOrdemProducaoDTO = z.infer<typeof updateOrdemProducaoSchema>

export async function updateOrdemProducao(
  ordemProducaoIdId: string,
  orgSlug: string,
  dto: UpdateOrdemProducaoDTO,
) {
  await api.put(
    `/organizations/${orgSlug}/ordens-producao/${ordemProducaoIdId}`,
    dto,
  )
}
