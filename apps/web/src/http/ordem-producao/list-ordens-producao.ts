import { Page, PageParams } from '@/types'

import { api } from '../api/axios'

export interface ListOrdensProducaoResponse {
  id: string
  cod: string
  descricao: string
  tiragem: number
  valorServico: number
  nomeCliente: string
}

export async function listOrdensProducao(
  orgSlug: string,
  { page = 0, size = 20, sort }: PageParams = {},
) {
  const response = await api.get<Page<ListOrdensProducaoResponse>>(
    `/organizations/${orgSlug}/ordens-producao/list`,
    {
      params: { page, size, sort },
    },
  )
  return response.data
}
