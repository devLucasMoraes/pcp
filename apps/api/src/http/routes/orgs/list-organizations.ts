import { roleSchema } from '@pcp/authorization'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { listOrganizationUseCase } from '@/domain/useCases/organization/ListOrganizationUseCase'
import { auth } from '@/http/middleware/auth'

export async function listOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/list',
      {
        schema: {
          tags: ['organizations'],
          summary: 'List organizations',
          security: [{ bearerAuth: [] }],
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
                  slug: z.string(),
                  avatarUrl: z.string().url().nullable(),
                  role: roleSchema,
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
        const userId = await req.getCurrentUserId()

        const pageRequest = {
          page: req.query?.page,
          size: req.query?.size,
          sort: req.query?.sort,
        }

        const result = await listOrganizationUseCase.execute(
          userId,
          pageRequest,
        )

        const usersWithRole = result.content.map(({ members, ...user }) => {
          return {
            ...user,
            role: members[0].role,
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
