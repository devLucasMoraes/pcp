import { MigrationInterface, QueryRunner } from 'typeorm'

export class V51752276201095 implements MigrationInterface {
  name = 'V51752276201095'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."tarefas_tipo_enum" RENAME TO "tarefas_tipo_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."tarefas_tipo_enum" AS ENUM('IMPRODUTIVO', 'PRODUTIVO', 'INTERVALO', 'PREPARACAO')`,
    )
    await queryRunner.query(
      `ALTER TABLE "tarefas" ALTER COLUMN "tipo" TYPE "public"."tarefas_tipo_enum" USING "tipo"::"text"::"public"."tarefas_tipo_enum"`,
    )
    await queryRunner.query(`DROP TYPE "public"."tarefas_tipo_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."tarefas_tipo_enum_old" AS ENUM('IMPRODUTIVO', 'PRODUTIVO', 'INTERVALO')`,
    )
    await queryRunner.query(
      `ALTER TABLE "tarefas" ALTER COLUMN "tipo" TYPE "public"."tarefas_tipo_enum_old" USING "tipo"::"text"::"public"."tarefas_tipo_enum_old"`,
    )
    await queryRunner.query(`DROP TYPE "public"."tarefas_tipo_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."tarefas_tipo_enum_old" RENAME TO "tarefas_tipo_enum"`,
    )
  }
}
