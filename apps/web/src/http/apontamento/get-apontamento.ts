import { api } from '../api/axios'

export interface GetApontamentoResponse {
  id: string
  dataIncio: string
  dataFim: string
  duracao: number
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

export async function getApontamento(orgSlug: string, apontamentoId: string) {
  const response = await api.get<GetApontamentoResponse>(
    `/organizations/${orgSlug}/apontamentos/${apontamentoId}`,
  )
  return response.data
}
