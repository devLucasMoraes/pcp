import { Account } from './Account'
import { Apontamento } from './Apontamento'
import { BaseAuditEntity } from './BaseAuditEntity'
import { Equipamento } from './Equipamento'
import { Member } from './Member'
import { Ocorrencia } from './Ocorrencia'
import { Operador } from './Operador'
import { OrdemProducao } from './OrdemProducao'
import { Organization } from './Organization'
import { RotinaTarefas } from './RotinaTarefas'
import { Setting } from './Setting'
import { Tarefa } from './Tarefa'
import { Token } from './Token'
import { User } from './User'

export const entities = [
  BaseAuditEntity,
  Account,
  Member,
  Organization,
  Setting,
  Token,
  User,
  Apontamento,
  Equipamento,
  Ocorrencia,
  Operador,
  RotinaTarefas,
  Tarefa,
  OrdemProducao,
]
