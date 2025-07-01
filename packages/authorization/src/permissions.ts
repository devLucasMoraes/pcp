import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN: (user, { can, cannot }) => {
    can('manage', 'all')

    cannot(['create', 'update', 'delete', 'get'], 'User')
    can(['create', 'update', 'get'], 'User', {
      organizationOwnerId: { $eq: user.id },
    })
    can(['delete'], 'User', {
      organizationOwnerId: { $eq: user.id },
      id: { $ne: user.id },
    })

    cannot(['transfer_ownership', 'update', 'delete'], 'Organization')
    can(['transfer_ownership', 'update', 'delete'], 'Organization', {
      ownerId: { $eq: user.id },
    })
  },
  MEMBER: (_, { can }) => {
    can(['create', 'get', 'update'], 'Ocorrencia')
    can(['create', 'get', 'update'], 'Operador')
    can(['create', 'get', 'update'], 'Rotina')
    can(['create', 'get', 'update'], 'Equipamento')
    can(['create', 'get', 'update'], 'OrdemProducao')
    can(['create', 'get', 'update'], 'Apontamento')
  },
  SUPER_ADMIN: (_, { can }) => {
    can('manage', 'all')
  },
}
