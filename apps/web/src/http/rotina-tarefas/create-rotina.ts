import { z } from 'zod'

import { TarefaTipo } from '../../constants/TarefaTipo'
import { api } from '../api/axios'

export const createRotinaSchema = z.object({
  descricao: z.string(),
  tarefas: z.array(
    z.object({
      tipo: z.nativeEnum(TarefaTipo),
      ocorrenciaId: z.string().uuid(),
    }),
  ),
})

export type CreateRotinaDTO = z.infer<typeof createRotinaSchema>

export interface CreateRotinaResponse {
  rotinaId: string
}

export async function createRotina(orgSlug: string, dto: CreateRotinaDTO) {
  const result = await api.post<CreateRotinaResponse>(
    `/organizations/${orgSlug}/rotinas`,
    dto,
  )

  return result.data
}
