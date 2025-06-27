import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Account } from './Account'
import { Member } from './Member'
import { Token } from './Token'
import { User } from './User'

@Entity({ name: 'organizations' })
@Index('IDX_ORGANIZATION_SLUG', ['slug'])
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'varchar', length: 255, unique: true })
  slug!: string

  @Column({ type: 'varchar', length: 255, name: 'avatar_url', nullable: true })
  avatarUrl!: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @Column({ type: 'uuid', name: 'created_by' })
  createdBy!: string

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @Column({ type: 'uuid', name: 'updated_by' })
  updatedBy!: string

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null

  @Column({ type: 'uuid', name: 'deleted_by', nullable: true })
  deletedBy!: string | null

  @OneToMany(() => Token, (token) => token.organization)
  tokens!: Token[]

  @OneToMany(() => Account, (account) => account.organization)
  accounts!: Account[]

  @OneToMany(() => Member, (member) => member.organization)
  members!: Member[]

  @Column({ type: 'uuid', name: 'owner_id' })
  ownerId!: string

  @ManyToOne(() => User, (user) => user.owns_organization)
  @JoinColumn({ name: 'owner' })
  owner!: User
}
