import { Page, PageParams } from '../../types'
import { api } from '../api/axios'

export interface ListOrganizationsResponse {
  id: string
  name: string
  slug: string
  avatarUrl: string | null
  role: string
}

export async function listOrganizations({
  page = 0,
  size = 20,
  sort,
}: PageParams = {}) {
  const response = await api.get<Page<ListOrganizationsResponse>>(
    `/organizations/list`,
    {
      params: { page, size, sort },
    },
  )

  return response.data
}
