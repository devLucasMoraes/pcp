import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createRotinaUseCase } from '@/domain/useCases/rotina-tarefas/createRotinaUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  descricao: z.string(),
  tarefas: z.array(
    z.object({
      tipo: z.string(),
      ocorrenciaId: z.string().uuid(),
    }),
  ),
})

export type CreateRotinaTarefasDTO = z.infer<typeof bodySchema>

export async function createRotina(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/rotinas',
      {
        schema: {
          tags: ['rotinas'],
          summary: 'Cria uma nova rotina',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: bodySchema,
          response: {
            201: z.object({
              rotinaId: z.string(),
            }),
          },
        },
      },
      async (req, res) => {
        const { slug } = req.params
        const { membership } = await req.getUserMembership(slug)

        const createRotinaDTO = req.body

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('create', 'Rotina')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const rotina = await createRotinaUseCase.execute(
          createRotinaDTO,
          membership,
        )

        app.io.in(slug).emit('invalidateRotinaCache', {
          operation: 'create',
          orgSlug: slug,
          rotinaId: rotina.id,
        })

        return res.status(201).send({ rotinaId: rotina.id })
      },
    )
}
