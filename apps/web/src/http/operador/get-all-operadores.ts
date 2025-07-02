import { api } from '../api/axios'

export interface GetAllOperadoresResponse {
  id: string
  nome: string
}

export async function getAllOperadores(orgSlug: string) {
  const response = await api.get<GetAllOperadoresResponse[]>(
    `/organizations/${orgSlug}/operadores`,
  )
  return response.data
}
