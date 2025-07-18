import { MigrationInterface, QueryRunner } from 'typeorm'

export class V81752869341377 implements MigrationInterface {
  name = 'V81752869341377'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ordens_producao" DROP COLUMN "descricao"`,
    )
    await queryRunner.query(
      `ALTER TABLE "ordens_producao" ADD "descricao" text NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ordens_producao" DROP COLUMN "descricao"`,
    )
    await queryRunner.query(
      `ALTER TABLE "ordens_producao" ADD "descricao" character varying(255) NOT NULL`,
    )
  }
}
