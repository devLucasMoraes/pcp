import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm'

export abstract class BaseAuditEntity {
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @Column({ type: 'uuid', name: 'created_by' })
  createdBy!: string

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @Column({ type: 'uuid', name: 'updated_by' })
  updatedBy!: string

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null

  @Column({ type: 'uuid', name: 'deleted_by', nullable: true })
  deletedBy!: string | null

  @Column({ type: 'uuid', name: 'organization_id' })
  organizationId!: string
}
