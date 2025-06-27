import { FastifyInstance } from 'fastify'

import { authWithPassword } from './auth-with-password'
import { createAccount } from './create-account'
import { getProfile } from './get-profile'
import { logout } from './logout'
import { refreshToken } from './refresh-token'
import { reqPasswordRecover } from './req-password-recover'
import { resetPassword } from './reset-password'

export default async function (app: FastifyInstance) {
  app.register(createAccount)
  app.register(authWithPassword)
  app.register(getProfile)
  app.register(reqPasswordRecover)
  app.register(resetPassword)
  app.register(refreshToken)
  app.register(logout)
}
