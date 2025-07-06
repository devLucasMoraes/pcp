import { z } from 'zod'

import { api } from '../api/axios'

export const updateApontamentoSchema = z.object({
  dataIncio: z.date(),
  dataFim: z.date(),
  qtdeApontada: z.coerce.number(),
  ocorrenciaId: z.string().uuid(),
  operadorId: z.string().uuid(),
  equipamentoId: z.string().uuid(),
  ordemProducaoId: z.string().uuid(),
})

export type UpdateApontamentoDTO = z.infer<typeof updateApontamentoSchema>

export async function updateApontamento(
  apontamentoId: string,
  orgSlug: string,
  dto: UpdateApontamentoDTO,
) {
  await api.put(`/organizations/${orgSlug}/apontamentos/${apontamentoId}`, dto)
}
