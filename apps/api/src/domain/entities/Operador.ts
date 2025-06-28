import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Apontamento } from './Apontamento'
import { BaseAuditEntity } from './BaseAuditEntity'

@Entity({ name: 'operadores' })
export class Operador extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  nome!: string

  @OneToMany(() => Apontamento, (apontamento) => apontamento.operador)
  apontamentos!: Apontamento[]
}
