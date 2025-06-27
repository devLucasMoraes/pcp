import { Page, PageParams } from '../../types'
import { api } from '../api/axios'

export interface ListUsersResponse {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  role: string
}

export async function listUsers(
  orgSlug: string,
  { page = 0, size = 20, sort }: PageParams = {},
) {
  const response = await api.get<Page<ListUsersResponse>>(
    `/organizations/${orgSlug}/users/list`,
    {
      params: { page, size, sort },
    },
  )

  return response.data
}
