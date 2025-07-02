import { z } from 'zod'

import { api } from '../api/axios'

export const updateOperadorSchema = z.object({
  nome: z.string(),
})

export type UpdateOperadorDTO = z.infer<typeof updateOperadorSchema>

export async function updateOperador(
  operadorId: string,
  orgSlug: string,
  dto: UpdateOperadorDTO,
) {
  await api.put(`/organizations/${orgSlug}/operadores/${operadorId}`, dto)
}
