import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateApontamentoUseCase } from '@/domain/useCases/apontamento/updateApontamentoUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  dataInicio: z.string(),
  dataFim: z.string(),
  qtdeApontada: z.coerce.number(),
  ocorrenciaId: z.string().uuid(),
  operadorId: z.string().uuid(),
  equipamentoId: z.string().uuid(),
  ordemProducaoId: z.string().uuid(),
})

export type UpdateApontamentoDTO = z.infer<typeof bodySchema>

export async function updateApontamento(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/apontamentos/:apontamentoId',
      {
        schema: {
          tags: ['apontamentos'],
          summary: 'Atualiza um apontamento por id',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            orgSlug: z.string(),
            apontamentoId: z.string(),
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

        if (cannot('update', 'Apontamento')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const updateApontamentoDTO = req.body

        const { apontamentoId } = req.params

        await updateApontamentoUseCase.execute(
          apontamentoId,
          updateApontamentoDTO,
          membership,
        )

        app.io.in(orgSlug).emit('invalidateApontamentoCache', {
          operation: 'update',
          orgSlug,
          apontamentoId,
        })

        return res.status(204).send()
      },
    )
}
