import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'

@Entity({ name: 'ordens_producao' })
export class OrdemProducao extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  descricao!: string

  @Column({ type: 'varchar', length: 255 })
  cor!: string
}
