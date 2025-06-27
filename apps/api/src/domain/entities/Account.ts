import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { AccountProvider } from './AccountProvider'
import { Organization } from './Organization'
import { User } from './User'

@Entity({ name: 'accounts' })
@Unique(['provider', 'user'])
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'enum', enum: AccountProvider })
  provider!: AccountProvider

  @Column({
    type: 'varchar',
    length: 255,
    name: 'provider_account_id',
    unique: true,
  })
  providerAccountId!: string

  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'user' })
  user!: User

  @ManyToOne(() => Organization, (org) => org.accounts, { nullable: true })
  @JoinColumn({ name: 'organization' })
  organization!: Organization | null
}
