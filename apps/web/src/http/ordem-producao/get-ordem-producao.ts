import { api } from '../api/axios'

export interface GetOrdemProducaoResponse {
  id: string
  cod: string
  descricao: string
  tiragem: number
  valorServico: number
  nomeCliente: string
}

export async function getOrdemProducao(
  orgSlug: string,
  ordemProducaoId: string,
) {
  const response = await api.get<GetOrdemProducaoResponse>(
    `/organizations/${orgSlug}/ordens-producao/${ordemProducaoId}`,
  )
  return response.data
}
