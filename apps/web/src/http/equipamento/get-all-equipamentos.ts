import { api } from '../api/axios'

export interface GetAllEquipamentosResponse {
  id: string
  nome: string
  rotinaTarefas: {
    id: string
    descricao: string
  }
}

export async function getAllEquipamentos(orgSlug: string) {
  const response = await api.get<GetAllEquipamentosResponse[]>(
    `/organizations/${orgSlug}/equipamentos`,
  )
  return response.data
}
