import { api } from '../api/axios'

export interface GetAllUsersResponse {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  role: string
}

export async function getAllUsers(orgSlug: string) {
  const response = await api.get<GetAllUsersResponse[]>(
    `/organizations/${orgSlug}/users`,
  )
  return response.data
}
