import { api } from '../api/axios'

export interface GetOrganizationsResponse {
  id: string
  name: string
  slug: string
  avatarUrl: string | null
  role: string
}

export async function getOrganizations() {
  const result = await api.get<GetOrganizationsResponse[]>(`/organizations`)
  return result.data
}
