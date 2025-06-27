import { z } from 'zod'

import { Role } from '../../constants/Role'
import { api } from '../api/axios'

export const updateUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  avatarUrl: z.string().url().nullable(),
  role: z.nativeEnum(Role),
})

export type UpdateUserDTO = z.infer<typeof updateUserSchema>

export async function updateUser(
  id: string,
  orgSlug: string,
  dto: UpdateUserDTO,
) {
  await api.put(`/organizations/${orgSlug}/users/${id}`, dto)
}
