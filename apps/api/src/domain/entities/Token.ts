import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Organization } from './Organization'
import { TokenType } from './TokenType'
import { User } from './User'

@Entity({ name: 'tokens' })
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'enum', enum: TokenType })
  type!: TokenType

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @ManyToOne(() => User, (user) => user.tokens)
  @JoinColumn({ name: 'user' })
  user!: User

  @ManyToOne(() => Organization, (org) => org.tokens, { nullable: true })
  @JoinColumn({ name: 'organization' })
  organization!: Organization | null
}
