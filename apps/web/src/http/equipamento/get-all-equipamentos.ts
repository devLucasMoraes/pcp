import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getAllEquipamentosUseCase } from '@/domain/useCases/equipamento/getAllEquipamentosUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getAllEquipamentos(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/equipamentos',
      {
        schema: {
          tags: ['equipamentos'],
          summary: 'Lista todas os equipamentos',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.string().uuid(),
                nome: z.string(),
                rotinaTarefas: z.object({
                  id: z.string().uuid(),
                  descricao: z.string(),
                }),
              }),
            ),
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

        const equipamentos = await getAllEquipamentosUseCase.execute(membership)

        return res.status(200).send(equipamentos)
      },
    )
}
