import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('settings')
export class Setting {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  key!: string

  @Column({ type: 'text' })
  value!: string
}
