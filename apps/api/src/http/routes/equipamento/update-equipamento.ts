import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateEquipamentoUseCase } from '@/domain/useCases/equipamento/updateEquipamentoUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  nome: z.string(),
  rotinaTarefasId: z.string().uuid(),
})

export type UpdateEquipamentoDTO = z.infer<typeof bodySchema>

export async function updateEquipamento(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/equipamentos/:equipamentoId',
      {
        schema: {
          tags: ['equipamentos'],
          summary: 'Atualiza um equipamento por id',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            orgSlug: z.string(),
            equipamentoId: z.string(),
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

        if (cannot('update', 'Equipamento')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const updateEquipamentoDTO = req.body

        const { equipamentoId } = req.params

        await updateEquipamentoUseCase.execute(
          equipamentoId,
          updateEquipamentoDTO,
          membership,
        )

        app.io.in(orgSlug).emit('invalidateEquipamentoCache', {
          operation: 'update',
          orgSlug,
          equipamentoId,
        })

        return res.status(204).send()
      },
    )
}
