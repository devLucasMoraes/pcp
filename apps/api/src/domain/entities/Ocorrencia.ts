import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Apontamento } from './Apontamento'
import { BaseAuditEntity } from './BaseAuditEntity'
import { Tarefa } from './Tarefa'

@Entity({ name: 'ocorrencias' })
export class Ocorrencia extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  descricao!: string

  @Column({ type: 'varchar', length: 255 })
  cor!: string

  @OneToMany(() => Apontamento, (apontamento) => apontamento.ocorrencia)
  apontamentos!: Apontamento[]

  @OneToMany(() => Tarefa, (tarefa) => tarefa.ocorrencia)
  tarefas!: Tarefa[]
}
