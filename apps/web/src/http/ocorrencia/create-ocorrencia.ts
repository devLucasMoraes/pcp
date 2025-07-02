import { z } from 'zod'

import { api } from '../api/axios'

export const createOcorrenciaSchema = z.object({
  descricao: z.string(),
  cor: z.string(),
})

export type CreateOcorrenciaDTO = z.infer<typeof createOcorrenciaSchema>

export interface CreateOcorrenciaResponse {
  ocorrenciaId: string
}

export async function createOcorrencia(
  orgSlug: string,
  dto: CreateOcorrenciaDTO,
) {
  const result = await api.post<CreateOcorrenciaResponse>(
    `/organizations/${orgSlug}/ocorrencias`,
    dto,
  )
  return result.data
}
