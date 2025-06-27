import 'fastify'

import { Member } from '@/domain/entities/Member'
import { Organization } from '@/domain/entities/Organization'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId: () => Promise<string>
    getUserMembership: (slug: string) => Promise<{
      membership: Member
      organization: Organization
    }>
  }
}
