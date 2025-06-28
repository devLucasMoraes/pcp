import { FastifyInstance } from 'fastify'

import { createOcorrencia } from './create-ocorrencia'
import { disableOcorrencia } from './disable-ocorrencia'
import { getAllOcorrencias } from './get-all-ocorrencias'
import { getOcorrencia } from './get-ocorrencia'
import { listOcorrencias } from './list-ocorrencias'
import { updateOcorrencia } from './update-ocorrencia'

export default async function (app: FastifyInstance) {
  app.register(createOcorrencia)
  app.register(disableOcorrencia)
  app.register(getAllOcorrencias)
  app.register(getOcorrencia)
  app.register(listOcorrencias)
  app.register(updateOcorrencia)
}
