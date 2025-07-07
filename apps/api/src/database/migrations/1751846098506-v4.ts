import { MigrationInterface, QueryRunner } from 'typeorm'

export class V41751846098506 implements MigrationInterface {
  name = 'V41751846098506'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "apontamentos" RENAME COLUMN "data_incio" TO "data_inicio"`,
    )
    await queryRunner.query(`ALTER TABLE "tarefas" DROP COLUMN "tipo"`)
    await queryRunner.query(
      `CREATE TYPE "public"."tarefas_tipo_enum" AS ENUM('IMPRODUTIVO', 'PRODUTIVO', 'INTERVALO')`,
    )
    await queryRunner.query(
      `ALTER TABLE "tarefas" ADD "tipo" "public"."tarefas_tipo_enum" NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tarefas" DROP COLUMN "tipo"`)
    await queryRunner.query(`DROP TYPE "public"."tarefas_tipo_enum"`)
    await queryRunner.query(
      `ALTER TABLE "tarefas" ADD "tipo" character varying(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "apontamentos" RENAME COLUMN "data_inicio" TO "data_incio"`,
    )
  }
}
