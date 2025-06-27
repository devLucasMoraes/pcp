import { FastifyInstance } from 'fastify'

import { createOrganizationalUser } from './create-organizational-user'
import { deleteUser } from './delete-user'
import { getAllUsers } from './get-all-users'
import { getUser } from './get-user'
import { listUsers } from './list-users'
import { updateUser } from './update-user'

export default async function (app: FastifyInstance) {
  app.register(createOrganizationalUser)
  app.register(deleteUser)
  app.register(getAllUsers)
  app.register(getUser)
  app.register(listUsers)
  app.register(updateUser)
}
