import { Entity, PrimaryGeneratedColumn } from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'

@Entity({ name: 'tarefas' })
export class Tarefa extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string
}
