import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { listRotinaUseCase } from '@/domain/useCases/rotina-tarefas/listRotinaUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function listRotinas(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/rotinas/list',
      {
        schema: {
          tags: ['rotinas'],
          summary: 'Lista paginada de ocorrências',
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
                  descricao: z.string(),
                  tarefas: z.array(
                    z.object({
                      id: z.string().uuid(),
                      tipo: z.string(),
                      ocorrencia: z.object({
                        id: z.string().uuid(),
                        descricao: z.string(),
                        cor: z.string(),
                      }),
                    }),
                  ),
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

        const { membership } = await req.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('get', 'Rotina')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const pageRequest = {
          page: req.query?.page,
          size: req.query?.size,
          sort: req.query?.sort,
        }

        const result = await listRotinaUseCase.execute(membership, pageRequest)

        return res.status(201).send(result)
      },
    )
}
