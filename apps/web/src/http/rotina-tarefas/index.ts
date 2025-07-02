import { FastifyInstance } from 'fastify'

import { createRotina } from './create-rotina'
import { disableRotina } from './disable-rotina'
import { getAllRotinas } from './get-all-rotinas'
import { getRotina } from './get-rotina'
import { listRotinas } from './list-rotinas'
import { updateRotina } from './update-ocorrencia'

export default async function (app: FastifyInstance) {
  app.register(createRotina)
  app.register(disableRotina)
  app.register(getAllRotinas)
  app.register(getRotina)
  app.register(listRotinas)
  app.register(updateRotina)
}
