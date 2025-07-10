import { FastifyInstance } from 'fastify'

import { createApontamento } from './create-apontamento'
import { createMultipleApontamentos } from './create-multiple-apontamentos'
import { disableApontamento } from './disable-apontamento'
import { getAllApontamentos } from './get-all-apontamentos'
import { getApontamento } from './get-apontamento'
import { getTotaisProducao } from './get-totais-producao'
import { listApontamentos } from './list-apontamentos'
import { updateApontamento } from './update-apontamento'

export default async function (app: FastifyInstance) {
  app.register(createApontamento)
  app.register(disableApontamento)
  app.register(getAllApontamentos)
  app.register(getApontamento)
  app.register(listApontamentos)
  app.register(updateApontamento)
  app.register(getTotaisProducao)
  app.register(createMultipleApontamentos)
}
