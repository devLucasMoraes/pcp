import { FastifyInstance } from 'fastify'

import { createOrdemProducao } from './create-ordem-producao'
import { disableOrdemProducao } from './disable-ordem-producao'
import { getAllOrdensProducao } from './get-all-ordens-producao'
import { getOrdemProducao } from './get-ordem-producao'
import { listOrdensProducao } from './list-ordens-producao'
import { updateOrdemProducao } from './update-ordem-producao'

export default async function (app: FastifyInstance) {
  app.register(createOrdemProducao)
  app.register(disableOrdemProducao)
  app.register(getAllOrdensProducao)
  app.register(getOrdemProducao)
  app.register(listOrdensProducao)
  app.register(updateOrdemProducao)
}
