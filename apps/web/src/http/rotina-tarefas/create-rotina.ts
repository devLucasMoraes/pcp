import { z } from 'zod'

import { api } from '../api/axios'

export const createRotinaSchema = z.object({
  descricao: z.string(),
  tarefas: z.array(
    z.object({
      tipo: z.string(),
      ocorrenciaId: z.string().uuid(),
    }),
  ),
})

export type CreateRotinaTarefasDTO = z.infer<typeof createRotinaSchema>

export interface CreateRotinaResponse {
  rotinaId: string
}

export async function createRotina(
  orgSlug: string,
  dto: CreateRotinaTarefasDTO,
) {
  const result = await api.post<CreateRotinaResponse>(
    `/organizations/${orgSlug}/rotinas`,
    dto,
  )

  return result.data
}
