import { api } from '../api/axios'

export interface GetAllOcorrenciasResponse {
  id: string
  descricao: string
  cor: string
}
export async function getAllOcorrencias(orgSlug: string) {
  const response = await api.get<GetAllOcorrenciasResponse[]>(
    `/organizations/${orgSlug}/ocorrencias`,
  )
  return response.data
}
