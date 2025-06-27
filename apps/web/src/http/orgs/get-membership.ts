import { api } from '../api/axios'

export interface GetMembershipResponse {
  id: string
  role: string
  organizationId: string
}
export async function getMembership() {
  const result = await api.get<GetMembershipResponse>('/membership')
  return result.data
}
