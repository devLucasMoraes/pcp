import { Page, PageParams } from '@/types'

import { api } from '../api/axios'

export interface ListEquipamentosResponse {
  id: string
  nome: string
  rotinaTarefas: {
    id: string
    descricao: string
  }
}

export async function listEquipamentos(
  orgSlug: string,
  { page = 0, size = 20, sort }: PageParams = {},
) {
  const response = await api.get<Page<ListEquipamentosResponse>>(
    `/organizations/${orgSlug}/equipamentos/list`,
    {
      params: { page, size, sort },
    },
  )
  return response.data
}
