import { z } from 'zod'

import { TarefaTipo } from '../../constants/TarefaTipo'
import { api } from '../api/axios'

export const updateRotinaSchema = z.object({
  descricao: z.string(),
  tarefas: z.array(
    z.object({
      id: z.string().uuid().nullish(),
      tipo: z.nativeEnum(TarefaTipo),
      ocorrenciaId: z.string().uuid(),
    }),
  ),
})

export type UpdateRotinaDTO = z.infer<typeof updateRotinaSchema>

export async function updateRotina(
  rotinaId: string,
  orgSlug: string,
  dto: UpdateRotinaDTO,
) {
  await api.put(`/organizations/${orgSlug}/rotinas/${rotinaId}`, dto)
}
