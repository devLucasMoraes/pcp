import { api } from '../api/axios'
export interface GetOcorrenciaResponse {
  id: string
  descricao: string
  cor: string
}
export async function getOcorrencia(orgSlug: string, ocorrenciaId: string) {
  const response = await api.get<GetOcorrenciaResponse>(
    `/organizations/${orgSlug}/ocorrencias/${ocorrenciaId}`,
  )
  return response.data
}
