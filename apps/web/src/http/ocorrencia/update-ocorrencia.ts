import { z } from 'zod'

import { api } from '../api/axios'

export const updateOcorrenciaSchema = z.object({
  descricao: z.string(),
  cor: z.string(),
})

export type UpdateOcorrenciaDTO = z.infer<typeof updateOcorrenciaSchema>

export async function updateOcorrencia(
  ocorrenciaId: string,
  orgSlug: string,
  dto: UpdateOcorrenciaDTO,
) {
  await api.put(`/organizations/${orgSlug}/ocorrencias/${ocorrenciaId}`, dto)
}
