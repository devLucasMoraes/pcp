import { MemberRepository } from './MemberRepository'
import { OrganizationRepository } from './OrganizationRepository'
import { TokenRepository } from './TokenRepository'
import { UserRepository } from './UserRepository'

const user = new UserRepository()
const organization = new OrganizationRepository()
const member = new MemberRepository()
const token = new TokenRepository()

export const repository = {
  user,
  organization,
  member,
  token,
}
