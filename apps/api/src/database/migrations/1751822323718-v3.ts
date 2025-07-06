import { MigrationInterface, QueryRunner } from 'typeorm'

export class V31751822323718 implements MigrationInterface {
  name = 'V31751822323718'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "apontamentos" ADD "qtde_apontada" numeric(10,2) NOT NULL DEFAULT '0'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "apontamentos" DROP COLUMN "qtde_apontada"`,
    )
  }
}
