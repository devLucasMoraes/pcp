import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'
import { Tarefa } from './Tarefa'

@Entity({ name: 'rotina_tarefas' })
export class RotinaTarefas extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  descricao!: string

  @OneToMany(() => Tarefa, (tarefa) => tarefa.rotinaTarefas, {
    cascade: true,
  })
  tarefas!: Tarefa[]
}
