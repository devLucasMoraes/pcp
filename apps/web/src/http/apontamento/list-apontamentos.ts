import { Page, PageParams } from '@/types'

import { api } from '../api/axios'

export interface ListApontamentosResponse {
  id: string
  dataIncio: string
  dataFim: string
  duracao: number
  qtdeApontada: number
  ocorrencia: {
    id: string
    descricao: string
  }
  operador: {
    id: string
    nome: string
  }
  equipamento: {
    id: string
    nome: string
  }
  ordemProducao: {
    id: string
    cod: string
    descricao: string
    tiragem: number
    valorServico: number
    nomeCliente: string
  }
}

export async function listApontamentos(
  orgSlug: string,
  { page = 0, size = 20, sort }: PageParams = {},
) {
  const response = await api.get<Page<ListApontamentosResponse>>(
    `/organizations/${orgSlug}/apontamentos/list`,
    {
      params: { page, size, sort },
    },
  )
  return response.data
}
