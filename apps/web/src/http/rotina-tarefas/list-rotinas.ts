import { Page, PageParams } from '@/types'

import { api } from '../api/axios'

export interface ListRotinasResponse {
  id: string
  descricao: string
  tarefas: {
    id: string
    tipo: string
    ocorrencia: {
      id: string
      descricao: string
      cor: string
    }
  }[]
}
export async function listRotinas(
  orgSlug: string,
  { page = 0, size = 20, sort }: PageParams = {},
) {
  const response = await api.get<Page<ListRotinasResponse>>(
    `/organizations/${orgSlug}/rotinas/list`,
    {
      params: { page, size, sort },
    },
  )
  return response.data
}
