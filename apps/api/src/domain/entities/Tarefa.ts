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

@Entity({ name: 'tarefas' })
export class Tarefa extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  tipo!: string

  @ManyToOne(() => Ocorrencia, (ocrr) => ocrr.tarefas)
  @JoinColumn({ name: 'ocorrencia' })
  ocorrencia!: Ocorrencia

  @ManyToOne(() => RotinaTarefas, (rotina) => rotina.tarefas, {
    orphanedRowAction: 'soft-delete',
  })
  @JoinColumn({ name: 'rotina_tarefas' })
  rotinaTarefas!: RotinaTarefas
}
