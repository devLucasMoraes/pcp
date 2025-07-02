import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getApontamentoUseCase } from '@/domain/useCases/apontamento/getApontamentoUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getApontamento(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/apontamentos/:apontamentoId',
      {
        schema: {
          tags: ['apontamentos'],
          summary: 'Retorna um apontamento por id',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            apontamentoId: z.string(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              dataIncio: z.date(),
              dataFim: z.date(),
              duracao: z.coerce.number(),
              ocorrencia: z.object({
                id: z.string().uuid(),
                descricao: z.string(),
              }),
              operador: z.object({
                id: z.string().uuid(),
                nome: z.string(),
              }),
              equipamento: z.object({
                id: z.string().uuid(),
                nome: z.string(),
              }),
              ordemProducao: z.object({
                id: z.string().uuid(),
                cod: z.string(),
                descricao: z.string(),
                tiragem: z.coerce.number(),
                valorServico: z.coerce.number(),
                nomeCliente: z.string(),
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

        if (cannot('get', 'Apontamento')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const { apontamentoId } = req.params

        const apontamento = await getApontamentoUseCase.execute(apontamentoId)

        return res.status(200).send(apontamento)
      },
    )
}
