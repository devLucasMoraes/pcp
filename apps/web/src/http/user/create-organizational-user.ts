import { z } from 'zod'

import { Role } from '../../constants/Role'
import { api } from '../api/axios'

export const createOrganizationalUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  avatarUrl: z.string().url().nullable(),
  role: z.nativeEnum(Role),
})

export type CreateOrganizationalUserDTO = z.infer<
  typeof createOrganizationalUserSchema
>

export interface CreateOrganizationalUserResponse {
  userId: string
}

export async function createOrganizationalUser(
  orgSlug: string,
  dto: CreateOrganizationalUserDTO,
) {
  const result = await api.post<CreateOrganizationalUserResponse>(
    `/organizations/${orgSlug}/users`,
    dto,
  )
  return result.data
}
