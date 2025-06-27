import { FastifyInstance } from 'fastify'

import { createOrganization } from './create-organization'
import { getMembership } from './get-membership'
import { getOrganization } from './get-organization'
import { getOrganizations } from './get-organizations'
import { listOrganizations } from './list-organizations'
import { shtutdownOrganization } from './shutdown-organization'
import { updateOrganization } from './update-organization'

export default async function (app: FastifyInstance) {
  app.register(createOrganization)
  app.register(getMembership)
  app.register(getOrganizations)
  app.register(getOrganization)
  app.register(updateOrganization)
  app.register(shtutdownOrganization)
  app.register(listOrganizations)
  // app.register(transferOrganization)
}
