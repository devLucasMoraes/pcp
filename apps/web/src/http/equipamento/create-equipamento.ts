import { z } from 'zod'

import { api } from '../api/axios'

export const createEquipamentoSchema = z.object({
  nome: z.string(),
  rotinaTarefasId: z.string().uuid(),
})

export type CreateEquipamentoDTO = z.infer<typeof createEquipamentoSchema>

export interface CreateEquipamentoResponse {
  equipamentoId: string
}
export async function createEquipamento(
  orgSlug: string,
  dto: CreateEquipamentoDTO,
) {
  const result = await api.post<CreateEquipamentoResponse>(
    `/organizations/${orgSlug}/equipamentos`,
    dto,
  )

  return result.data
}
