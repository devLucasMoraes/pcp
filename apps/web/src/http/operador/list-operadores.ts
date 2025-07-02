import { Page, PageParams } from '@/types'

import { api } from '../api/axios'

export interface ListOperadoresResponse {
  id: string
  nome: string
}

export async function listOperadores(
  orgSlug: string,
  { page = 0, size = 20, sort }: PageParams = {},
) {
  const response = await api.get<Page<ListOperadoresResponse>>(
    `/organizations/${orgSlug}/operadores/list`,
    {
      params: { page, size, sort },
    },
  )
  return response.data
}
