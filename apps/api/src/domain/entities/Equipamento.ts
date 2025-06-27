import { Entity, PrimaryGeneratedColumn } from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'

@Entity({ name: 'equipamentos' })
export class Equipamento extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string
}
