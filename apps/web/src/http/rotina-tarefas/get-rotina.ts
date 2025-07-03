import { api } from '../api/axios'

export interface GetRotinaResponse {
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

export async function getRotina(orgSlug: string, rotinaId: string) {
  const response = await api.get<GetRotinaResponse>(
    `/organizations/${orgSlug}/rotinas/${rotinaId}`,
  )
  return response.data
}
