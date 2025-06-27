import { api } from '../api/axios'

export interface GetUserResponse {
  id: string
  name: string
  email: string
  avatarUrl: string | null
}

export async function getUser(orgSlug: string, userId: string) {
  const response = await api.get<GetUserResponse>(
    `/organizations/${orgSlug}/users/${userId}`,
  )
  return response.data
}
