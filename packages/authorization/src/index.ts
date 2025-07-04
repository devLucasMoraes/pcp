import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { z } from 'zod'

import { User } from './models/user'
import { permissions } from './permissions'
import { apontamentoSubject } from './subjects/apontamento'
import { equipamentoSubject } from './subjects/equipamento'
import { ocorrenciaSubject } from './subjects/ocorrencia'
import { operadorSubject } from './subjects/operador'
import { ordemProducaoSubject } from './subjects/ordemProducao'
import { organizationSubject } from './subjects/organization'
import { rotinaSubject } from './subjects/rotinaTarefas'
import { userSubject } from './subjects/user'

export * from './models/organization'
export * from './models/user'
export * from './roles'

const appAbility = z.union([
  organizationSubject,
  userSubject,
  ocorrenciaSubject,
  operadorSubject,
  rotinaSubject,
  equipamentoSubject,
  ordemProducaoSubject,
  apontamentoSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbility>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType: (subject) => subject.__typename,
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}
