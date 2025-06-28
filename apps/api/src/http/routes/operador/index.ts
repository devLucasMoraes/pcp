import { FastifyInstance } from 'fastify'

import { createOperador } from './create-operador'
import { disableOperador } from './disable-operador'
import { getAllOperadores } from './get-all-operadores'
import { getOperador } from './get-operador'
import { listOperadores } from './list-operadores'
import { updateOperador } from './update-operador'

export default async function (app: FastifyInstance) {
  app.register(createOperador)
  app.register(disableOperador)
  app.register(getAllOperadores)
  app.register(getOperador)
  app.register(listOperadores)
  app.register(updateOperador)
}
