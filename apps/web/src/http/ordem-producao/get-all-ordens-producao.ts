import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getAllOrdensProducaoUseCase } from '@/domain/useCases/ordem-producao/getAllOrdensProducaoUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getAllOrdensProducao(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/ordens-producao',
      {
        schema: {
          tags: ['ordens-producao'],
          summary: 'Lista todas as ordens de producao',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.string().uuid(),
                cod: z.string(),
                descricao: z.string(),
                tiragem: z.coerce.number(),
                valorServico: z.coerce.number(),
                nomeCliente: z.string(),
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

        if (cannot('get', 'OrdemProducao')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const ordens = await getAllOrdensProducaoUseCase.execute(membership)

        return res.status(200).send(ordens)
      },
    )
}
