import { api } from '../api/axios'

export interface GetOperadorResponse {
  id: string
  nome: string
}

export async function getOperador(orgSlug: string, operadorId: string) {
  const response = await api.get<GetOperadorResponse>(
    `/organizations/${orgSlug}/operadores/${operadorId}`,
  )
  return response.data
}
