import { z } from 'zod'

import { api } from '../api/axios'

export const updateEquipamentoSchema = z.object({
  nome: z.string(),
  rotinaTarefasId: z.string().uuid(),
})

export type UpdateEquipamentoDTO = z.infer<typeof updateEquipamentoSchema>

export async function updateEquipamento(
  equipamentoId: string,
  orgSlug: string,
  dto: UpdateEquipamentoDTO,
) {
  await api.put(`/organizations/${orgSlug}/equipamentos/${equipamentoId}`, dto)
}
