import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateRotinaUseCase } from '@/domain/useCases/rotina-tarefas/updateRotinaUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  descricao: z.string(),
  tarefas: z.array(
    z.object({
      id: z.string().uuid().nullish(),
      tipo: z.string(),
      ocorrenciaId: z.string().uuid(),
    }),
  ),
})

export type UpdateRotinaDTO = z.infer<typeof bodySchema>

export async function updateRotina(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/rotinas/:rotinaId',
      {
        schema: {
          tags: ['rotinas'],
          summary: 'Atualiza uma rotina',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            orgSlug: z.string(),
            rotinaId: z.string(),
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

        if (cannot('update', 'Rotina')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const updateRotinaDTO = req.body

        const { rotinaId } = req.params

        await updateRotinaUseCase.execute(rotinaId, updateRotinaDTO, membership)

        app.io.in(orgSlug).emit('invalidateRotinaCache', {
          operation: 'update',
          orgSlug,
          rotinaId,
        })

        return res.status(204).send()
      },
    )
}
