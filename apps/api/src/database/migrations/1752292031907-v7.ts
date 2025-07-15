import { MigrationInterface, QueryRunner } from 'typeorm'

export class V71752292031907 implements MigrationInterface {
  name = 'V71752292031907'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "apontamentos" DROP COLUMN "data_inicio"`,
    )
    await queryRunner.query(
      `ALTER TABLE "apontamentos" ADD "data_inicio" TIMESTAMP NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "apontamentos" DROP COLUMN "data_fim"`)
    await queryRunner.query(
      `ALTER TABLE "apontamentos" ADD "data_fim" TIMESTAMP NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "apontamentos" DROP COLUMN "data_fim"`)
    await queryRunner.query(
      `ALTER TABLE "apontamentos" ADD "data_fim" TIMESTAMP WITH TIME ZONE NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "apontamentos" DROP COLUMN "data_inicio"`,
    )
    await queryRunner.query(
      `ALTER TABLE "apontamentos" ADD "data_inicio" TIMESTAMP WITH TIME ZONE NOT NULL`,
    )
  }
}
