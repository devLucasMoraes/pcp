import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { disableEquipamentoUseCase } from '@/domain/useCases/equipamento/disableEquipamentoUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function disableEquipamento(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/equipamentos/:equipamentoId',
      {
        schema: {
          tags: ['equipamentos'],
          summary: 'Desativa um equipamento por id',
          security: [{ bearerAuth: [] }],
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
        const { orgSlug, equipamentoId } = req.params

        const { membership } = await req.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('disable', 'Equipamento')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        await disableEquipamentoUseCase.execute(equipamentoId, membership)

        app.io.in(orgSlug).emit('invalidateEquipamentoCache', {
          operation: 'disable',
          orgSlug,
          equipamentoId,
        })

        return res.status(204).send()
      },
    )
}
