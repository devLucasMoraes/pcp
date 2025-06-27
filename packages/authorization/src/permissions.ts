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
    console.log({ user })
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
    can(['create', 'get', 'update'], 'Categoria')
    can(['create', 'get', 'update'], 'Insumo')
    can(['create', 'get', 'update'], 'Setor')
    can(['create', 'get', 'update'], 'Parceiro')
    can(['create', 'get', 'update'], 'RequisicaoEstoque')
    can(['create', 'get', 'update'], 'Emprestimo')
    can(['create', 'get', 'update'], 'Fornecedora')
    can(['create', 'get', 'update'], 'Transportadora')
    can(['create', 'get', 'update'], 'NfeCompra')
    can(['create', 'get', 'update'], 'Vinculo')
    can(['get'], 'Estoque')
  },
  BILLING: (_, { can }) => {
    can('manage', 'Billing')
  },
  SUPER_ADMIN: (_, { can }) => {
    can('manage', 'all')
  },
}
