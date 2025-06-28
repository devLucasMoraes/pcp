import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'
import { Equipamento } from './Equipamento'
import { Ocorrencia } from './Ocorrencia'
import { Operador } from './Operador'
import { OrdemProducao } from './OrdemProducao'

@Entity({ name: 'apontamentos' })
export class Apontamento extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'data_incio', type: 'timestamp' })
  dataIncio!: Date

  @Column({ name: 'data_fim', type: 'timestamp' })
  dataFim!: Date

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  duracao!: number

  @ManyToOne(() => Ocorrencia, (ocorrencia) => ocorrencia.apontamentos)
  @JoinColumn({ name: 'ocorrencia' })
  ocorrencia!: Ocorrencia

  @ManyToOne(() => Operador, (operador) => operador.apontamentos)
  @JoinColumn({ name: 'operador' })
  operador!: Operador

  @ManyToOne(() => Equipamento, (equipamento) => equipamento.apontamentos)
  @JoinColumn({ name: 'equipamento' })
  equipamento!: Equipamento

  @ManyToOne(() => OrdemProducao)
  @JoinColumn({ name: 'ordem_producao' })
  ordemProducao!: OrdemProducao
}
