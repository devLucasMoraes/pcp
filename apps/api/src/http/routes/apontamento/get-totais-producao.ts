import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getTotaisProducaoUseCase } from '@/domain/useCases/apontamento/getTotaisProducaoUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getTotaisProducao(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/apontamentos/totais-producao',
      {
        schema: {
          tags: ['apontamentos'],
          summary: 'Obtém totais de produção por equipamento',
          params: z.object({
            orgSlug: z.string(),
          }),
          querystring: z.object({
            equipamentoId: z.string().uuid(),
            dataInicio: z.string(),
            dataFim: z.string(),
          }),
          response: {
            200: z.object({
              tempoProdutivo: z.coerce.number(),
              tempoImprodutivo: z.coerce.number(),
              tempoIntervalo: z.coerce.number(),
              tempoTotal: z.coerce.number(),
              qtdeTotal: z.coerce.number(),
            }),
          },
        },
      },
      async (req, res) => {
        const { orgSlug } = req.params
        const { equipamentoId, dataInicio, dataFim } = req.query

        const { membership } = await req.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('get', 'Apontamento')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const result = await getTotaisProducaoUseCase.execute(
          membership,
          equipamentoId,
          new Date(dataInicio),
          new Date(dataFim),
        )

        return res.status(200).send(result)
      },
    )
}
