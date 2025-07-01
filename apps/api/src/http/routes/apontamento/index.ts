import { FastifyInstance } from 'fastify'

import { createApontamento } from './create-apontamento'
import { disableApontamento } from './disable-apontamento'
import { getAllApontamentos } from './get-all-apontamentos'
import { getApontamento } from './get-apontamento'
import { listApontamentos } from './list-apontamentos'
import { updateApontamento } from './update-apontamento'

export default async function (app: FastifyInstance) {
  app.register(createApontamento)
  app.register(disableApontamento)
  app.register(getAllApontamentos)
  app.register(getApontamento)
  app.register(listApontamentos)
  app.register(updateApontamento)
}
