import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getEquipamentoUseCase } from '@/domain/useCases/equipamento/getEquipamentoUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getEquipamento(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/equipamentos/:equipamentoId',
      {
        schema: {
          tags: ['equipamentos'],
          summary: 'Retorna um equipamento por id',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            equipamentoId: z.string(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              nome: z.string(),
              rotinaTarefas: z.object({
                id: z.string().uuid(),
                descricao: z.string(),
              }),
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

        if (cannot('get', 'Equipamento')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const { equipamentoId } = req.params

        const equipamento = await getEquipamentoUseCase.execute(equipamentoId)

        return res.status(200).send(equipamento)
      },
    )
}
