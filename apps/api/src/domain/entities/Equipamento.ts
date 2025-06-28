import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Apontamento } from './Apontamento'
import { BaseAuditEntity } from './BaseAuditEntity'
import { RotinaTarefas } from './RotinaTarefas'

@Entity({ name: 'equipamentos' })
export class Equipamento extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  nome!: string

  @ManyToOne(() => RotinaTarefas)
  @JoinColumn({ name: 'rotina_tarefas' })
  rotinaTarefas!: RotinaTarefas

  @OneToMany(() => Apontamento, (apontamento) => apontamento.equipamento)
  apontamentos!: Apontamento[]
}
