import { FastifyInstance } from 'fastify'

import { createEquipamento } from './create-equipamento'
import { disableEquipamento } from './disable-equipamento'
import { getAllEquipamentos } from './get-all-equipamentos'
import { getEquipamento } from './get-equipamento'
import { listEquipamentos } from './list-equipamentos'
import { updateEquipamento } from './update-equipamento'

export default async function (app: FastifyInstance) {
  app.register(createEquipamento)
  app.register(disableEquipamento)
  app.register(getAllEquipamentos)
  app.register(getEquipamento)
  app.register(listEquipamentos)
  app.register(updateEquipamento)
}
