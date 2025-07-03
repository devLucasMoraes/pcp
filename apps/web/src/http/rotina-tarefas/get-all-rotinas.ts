import { api } from '../api/axios'

export interface GetAllRotinasResponse {
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
  }
}
export async function getAllRotinas(orgSlug: string) {
  const response = await api.get<GetAllRotinasResponse[]>(
    `/organizations/${orgSlug}/rotinas`,
  )
  return response.data
}
