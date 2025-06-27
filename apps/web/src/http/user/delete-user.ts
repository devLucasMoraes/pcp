import { api } from '../api/axios'

export async function deleteUser(userId: string, orgSlug: string) {
  await api.delete(`/organizations/${orgSlug}/users/${userId}`)
}
