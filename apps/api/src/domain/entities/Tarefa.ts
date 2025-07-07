import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'
import { Ocorrencia } from './Ocorrencia'
import { RotinaTarefas } from './RotinaTarefas'
import { TarefaTipo } from './TarefaTipo'

@Entity({ name: 'tarefas' })
export class Tarefa extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'enum', enum: TarefaTipo })
  tipo!: TarefaTipo

  @ManyToOne(() => Ocorrencia, (ocrr) => ocrr.tarefas)
  @JoinColumn({ name: 'ocorrencia' })
  ocorrencia!: Ocorrencia

  @ManyToOne(() => RotinaTarefas, (rotina) => rotina.tarefas, {
    orphanedRowAction: 'soft-delete',
  })
  @JoinColumn({ name: 'rotina_tarefas' })
  rotinaTarefas!: RotinaTarefas
}
