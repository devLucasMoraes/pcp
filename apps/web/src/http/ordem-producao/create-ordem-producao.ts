import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createOrdemProducaoUseCase } from '@/domain/useCases/ordem-producao/createOrdemProducaoUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  cod: z.string(),
  descricao: z.string(),
  tiragem: z.number(),
  valorServico: z.number(),
  nomeCliente: z.string(),
})

export type CreateOrdemProducaoDTO = z.infer<typeof bodySchema>

export async function createOrdemProducao(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/ordens-producao',
      {
        schema: {
          tags: ['ordens-producao'],
          summary: 'Cria uma nova ordem de produção',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: bodySchema,
          response: {
            201: z.object({
              ordemProducaoId: z.string(),
            }),
          },
        },
      },
      async (req, res) => {
        const { slug } = req.params
        const { membership } = await req.getUserMembership(slug)

        const createOrdemProducaoDTO = req.body

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('create', 'OrdemProducao')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const ordemProducao = await createOrdemProducaoUseCase.execute(
          createOrdemProducaoDTO,
          membership,
        )

        app.io.in(slug).emit('invalidateOrdemProducaoCache', {
          operation: 'create',
          orgSlug: slug,
          ordemProducaoId: ordemProducao.id,
        })

        return res.status(201).send({ ordemProducaoId: ordemProducao.id })
      },
    )
}
