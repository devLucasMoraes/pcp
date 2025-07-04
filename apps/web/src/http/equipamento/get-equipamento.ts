import { api } from '../api/axios'

export interface GetEquipamentoResponse {
  id: string
  nome: string
  rotinaTarefas: {
    id: string
    descricao: string
  }
}

export async function getEquipamento(orgSlug: string, equipamentoId: string) {
  const response = await api.get<GetEquipamentoResponse>(
    `/organizations/${orgSlug}/equipamentos/${equipamentoId}`,
  )
  return response.data
}
