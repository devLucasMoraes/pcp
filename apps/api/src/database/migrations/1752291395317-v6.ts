import { MigrationInterface, QueryRunner } from 'typeorm'

export class V61752291395317 implements MigrationInterface {
  name = 'V61752291395317'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "apontamentos" DROP COLUMN "data_inicio"`,
    )
    await queryRunner.query(
      `ALTER TABLE "apontamentos" ADD "data_inicio" TIMESTAMP WITH TIME ZONE NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "apontamentos" DROP COLUMN "data_fim"`)
    await queryRunner.query(
      `ALTER TABLE "apontamentos" ADD "data_fim" TIMESTAMP WITH TIME ZONE NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "apontamentos" DROP COLUMN "data_fim"`)
    await queryRunner.query(
      `ALTER TABLE "apontamentos" ADD "data_fim" TIMESTAMP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "apontamentos" DROP COLUMN "data_inicio"`,
    )
    await queryRunner.query(
      `ALTER TABLE "apontamentos" ADD "data_inicio" TIMESTAMP NOT NULL`,
    )
  }
}
