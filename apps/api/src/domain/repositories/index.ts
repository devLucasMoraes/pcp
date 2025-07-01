import { ApontamentoRepository } from './ApontamentoRepository'
import { EquipamentoRepository } from './EquipamentoRepository'
import { MemberRepository } from './MemberRepository'
import { OcorrenciaRepository } from './OcorrenciaRepository'
import { OperadorRepository } from './OperadorRepository'
import { OrdemProducaoRepository } from './OrdemProducaoRepository'
import { OrganizationRepository } from './OrganizationRepository'
import { RotinaTarefasRepository } from './RotinaTarefasRepository'
import { TokenRepository } from './TokenRepository'
import { UserRepository } from './UserRepository'

const user = new UserRepository()
const organization = new OrganizationRepository()
const member = new MemberRepository()
const token = new TokenRepository()
const ocorrencia = new OcorrenciaRepository()
const operador = new OperadorRepository()
const rotinaTarefas = new RotinaTarefasRepository()
const equipamento = new EquipamentoRepository()
const ordemProducao = new OrdemProducaoRepository()
const apontamento = new ApontamentoRepository()

export const repository = {
  user,
  organization,
  member,
  token,
  ocorrencia,
  operador,
  rotinaTarefas,
  equipamento,
  ordemProducao,
  apontamento,
}
