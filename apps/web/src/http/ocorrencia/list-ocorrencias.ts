import { Page, PageParams } from '@/types'

import { api } from '../api/axios'

export interface ListOcorrenciasResponse {
  id: string
  descricao: string
  cor: string
}

export async function listOcorrencias(
  orgSlug: string,
  { page = 0, size = 20, sort }: PageParams = {},
) {
  const response = await api.get<Page<ListOcorrenciasResponse>>(
    `/organizations/${orgSlug}/ocorrencias/list`,
    {
      params: { page, size, sort },
    },
  )
  return response.data
}
