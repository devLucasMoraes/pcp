import { userSchema } from '@pcp/authorization'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteUserUseCase } from '@/domain/useCases/user/DeleteUserUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/users/:userId',
      {
        schema: {
          tags: ['users'],
          summary: 'Delete a user by ID',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            userId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (req, res) => {
        const { orgSlug, userId } = req.params

        const { membership, organization } =
          await req.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        const user = userSchema.parse({
          id: userId,
          role: membership.role,
          organizationOwnerId: organization.ownerId,
        })

        if (cannot('delete', user)) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        await deleteUserUseCase.execute(userId, membership)

        app.io.in(orgSlug).emit('invalidateUserCache', {
          operation: 'delete',
          orgSlug,
          userId,
        })

        return res.status(204).send()
      },
    )
}
