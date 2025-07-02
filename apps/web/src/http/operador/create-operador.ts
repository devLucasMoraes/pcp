import { z } from 'zod'

import { api } from '../api/axios'

export const createOperadorSchema = z.object({
  nome: z.string(),
})

export type CreateOperadorDTO = z.infer<typeof createOperadorSchema>

export interface CreateOperadorResponse {
  operadorId: string
}

export async function createOperador(orgSlug: string, dto: CreateOperadorDTO) {
  const result = await api.post<CreateOperadorResponse>(
    `/organizations/${orgSlug}/operadores`,
    dto,
  )
  return result.data
}
