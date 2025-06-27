import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'

@Entity({ name: 'ordens_producao' })
export class OrdemProducao extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  cod!: string

  @Column({ type: 'varchar', length: 255 })
  descricao!: string

  @Column({ type: 'numeric' })
  tiragem!: number

  @Column({ name: 'valor_servico', type: 'numeric' })
  valorServico!: number

  @Column({ name: 'nome_cliente', type: 'varchar', length: 255 })
  nomeCliente!: string
}
