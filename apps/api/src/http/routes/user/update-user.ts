import { userSchema } from '@pcp/authorization'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Role } from '@/domain/entities/Role'
import { updateUserUseCase } from '@/domain/useCases/user/UpdateUserUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  avatarUrl: z.string().url().nullable(),
  role: z.nativeEnum(Role),
})

export type UpdateUserDTO = z.infer<typeof bodySchema>

export async function updateUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/users/:userId',
      {
        schema: {
          tags: ['users'],
          summary: 'altera uma usuario',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
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
        const { orgSlug } = req.params

        const { membership, organization } =
          await req.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        const authUser = userSchema.parse({
          ...membership.user,
          role: membership.role,
          organizationOwnerId: organization.ownerId,
        })

        if (cannot('update', authUser)) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const updateCategoriaDTO = req.body

        const { userId } = req.params

        await updateUserUseCase.execute(userId, updateCategoriaDTO, membership)

        app.io.in(orgSlug).emit('invalidateUserCache', {
          operation: 'update',
          orgSlug,
          userId,
        })

        return res.status(204).send()
      },
    )
}
