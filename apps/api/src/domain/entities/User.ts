import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Account } from './Account'
import { Member } from './Member'
import { Organization } from './Organization'
import { Token } from './Token'

export enum UserType {
  MASTER = 'MASTER',
  ORGANIZATIONAL = 'ORGANIZATIONAL',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string

  @Column({ type: 'varchar', length: 255 })
  password!: string

  @Column({ type: 'varchar', length: 255, name: 'avatar_url', nullable: true })
  avatarUrl!: string | null

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.MASTER,
    name: 'user_type',
  })
  userType!: UserType

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdBy!: string | null

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @Column({ type: 'uuid', name: 'updated_by', nullable: true })
  updatedBy!: string | null

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null

  @Column({ type: 'uuid', name: 'deleted_by', nullable: true })
  deletedBy!: string | null

  @OneToMany(() => Organization, (org) => org.owner)
  owns_organization!: Organization[]

  @OneToMany(() => Token, (token) => token.user)
  tokens!: Token[]

  @OneToMany(() => Account, (account) => account.user)
  accounts!: Account[]

  @OneToMany(() => Member, (member) => member.user)
  memberOn!: Member[]
}
