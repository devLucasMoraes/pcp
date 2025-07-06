import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createApontamentoUseCase } from '@/domain/useCases/apontamento/createApontamentoUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  dataIncio: z.string(),
  dataFim: z.string(),
  qtdeApontada: z.coerce.number(),
  ocorrenciaId: z.string().uuid(),
  operadorId: z.string().uuid(),
  equipamentoId: z.string().uuid(),
  ordemProducaoId: z.string().uuid(),
})

export type CreateApontamentoDTO = z.infer<typeof bodySchema>

export async function createApontamento(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/apontamentos',
      {
        schema: {
          tags: ['apontamentos'],
          summary: 'Cria um novo apontamento',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: bodySchema,
          response: {
            201: z.object({
              apontamentoId: z.string(),
            }),
          },
        },
      },
      async (req, res) => {
        const { slug } = req.params
        const { membership } = await req.getUserMembership(slug)

        const createApontamentoDTO = req.body

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('create', 'Apontamento')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const apontamento = await createApontamentoUseCase.execute(
          createApontamentoDTO,
          membership,
        )

        app.io.in(slug).emit('invalidateApontamentoCache', {
          operation: 'create',
          orgSlug: slug,
          apontamentoId: apontamento.id,
        })

        return res.status(201).send({ apontamentoId: apontamento.id })
      },
    )
}
