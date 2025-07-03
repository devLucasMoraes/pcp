import { api } from '../api/axios'

export interface GetAllOrdensProducaoResponse {
  id: string
  cod: string
  descricao: string
  tiragem: number
  valorServico: number
  nomeCliente: string
}

export async function getAllOrdensProducao(orgSlug: string) {
  const response = await api.get<GetAllOrdensProducaoResponse[]>(
    `/organizations/${orgSlug}/ordens-producao`,
  )
  return response.data
}
