import { MemberRepository } from './MemberRepository'
import { OcorrenciaRepository } from './OcorrenciaRepository'
import { OperadorRepository } from './OperadorRepository'
import { OrganizationRepository } from './OrganizationRepository'
import { TokenRepository } from './TokenRepository'
import { UserRepository } from './UserRepository'

const user = new UserRepository()
const organization = new OrganizationRepository()
const member = new MemberRepository()
const token = new TokenRepository()
const ocorrencia = new OcorrenciaRepository()
const operador = new OperadorRepository()

export const repository = {
  user,
  organization,
  member,
  token,
  ocorrencia,
  operador,
}
