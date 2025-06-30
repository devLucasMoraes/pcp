import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateOrdemProducaoUseCase } from '@/domain/useCases/ordem-producao/updateOrdemProducaoUseCase'
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

export type UpdateOrdemProducaoDTO = z.infer<typeof bodySchema>

export async function updateOrdemProducao(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/ordens-producao/:ordemProducaoId',
      {
        schema: {
          tags: ['ordens-producao'],
          summary: 'Atualiza um ordem de producao por id',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            orgSlug: z.string(),
            ordemProducaoId: z.string(),
          }),
          response: {
            204: z.null(),
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

        if (cannot('update', 'OrdemProducao')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const updateOrdemProducaoDTO = req.body

        const { ordemProducaoId } = req.params

        await updateOrdemProducaoUseCase.execute(
          ordemProducaoId,
          updateOrdemProducaoDTO,
          membership,
        )

        app.io.in(orgSlug).emit('invalidateOrdemProducaoCache', {
          operation: 'update',
          orgSlug,
          ordemProducaoId,
        })

        return res.status(204).send()
      },
    )
}
