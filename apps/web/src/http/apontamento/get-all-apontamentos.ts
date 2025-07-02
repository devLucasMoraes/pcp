import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getAllApontamentosUseCase } from '@/domain/useCases/apontamento/getAllApontamentosUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getAllApontamentos(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/apontamentos',
      {
        schema: {
          tags: ['apontamentos'],
          summary: 'Lista todos os apontamentos',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
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

        if (cannot('get', 'Apontamento')) {
          throw new ForbiddenError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const apontamentos = await getAllApontamentosUseCase.execute(membership)

        return res.status(200).send(apontamentos)
      },
    )
}
