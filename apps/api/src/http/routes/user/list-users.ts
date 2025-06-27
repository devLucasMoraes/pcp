import { userSchema } from '@pcp/authorization'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Role } from '@/domain/entities/Role'
import { listUserUseCase } from '@/domain/useCases/user/ListUserUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function listUsers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/users/list',
      {
        schema: {
          tags: ['users'],
          summary: 'List users',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          querystring: z
            .object({
              page: z.coerce.number().optional(),
              size: z.coerce.number().optional(),
              sort: z.union([z.string(), z.array(z.string())]).optional(),
            })
            .optional(),
          response: {
            201: z.object({
              content: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  email: z.string().email(),
                  avatarUrl: z.string().url().nullable(),
                  role: z.nativeEnum(Role),
                }),
              ),
              totalPages: z.number(),
              totalElements: z.number(),
              size: z.number(),
              number: z.number(),
              numberOfElements: z.number(),
              empty: z.boolean(),
            }),
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

        if (cannot('get', authUser)) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const pageRequest = {
          page: req.query?.page,
          size: req.query?.size,
          sort: req.query?.sort,
        }

        const result = await listUserUseCase.execute(membership, pageRequest)

        const usersWithRole = result.content.map(({ memberOn, ...user }) => {
          return {
            ...user,
            role: memberOn[0].role,
          }
        })

        return res.status(201).send({
          content: usersWithRole,
          totalPages: result.totalPages,
          totalElements: result.totalElements,
          size: result.size,
          number: result.number,
          numberOfElements: result.numberOfElements,
          empty: result.empty,
        })
      },
    )
}
