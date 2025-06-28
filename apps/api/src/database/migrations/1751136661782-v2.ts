import { MigrationInterface, QueryRunner } from 'typeorm'

export class V21751136661782 implements MigrationInterface {
  name = 'V21751136661782'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ocorrencias" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descricao" character varying(255) NOT NULL, "cor" character varying(255) NOT NULL, CONSTRAINT "PK_a04319dc4023e6a220648bf6006" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "tarefas" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tipo" character varying(255) NOT NULL, "ocorrencia" uuid, "rotina_tarefas" uuid, CONSTRAINT "PK_2f57a4443470e61ac5de297e30a" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "rotina_tarefas" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descricao" character varying(255) NOT NULL, CONSTRAINT "PK_51cabfe392fcdee9e803f05a47b" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "equipamentos" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(255) NOT NULL, "rotina_tarefas" uuid, CONSTRAINT "PK_0db94e9eed96824cb4446343a86" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "operadores" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(255) NOT NULL, CONSTRAINT "PK_1b500ff0acb5b5061f998a8bf77" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "ordens_producao" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cod" character varying(255) NOT NULL, "descricao" character varying(255) NOT NULL, "tiragem" numeric NOT NULL, "valor_servico" numeric NOT NULL, "nome_cliente" character varying(255) NOT NULL, CONSTRAINT "PK_13b02d2a6a4befe7eb44a14dd62" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "apontamentos" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_incio" TIMESTAMP NOT NULL, "data_fim" TIMESTAMP NOT NULL, "duracao" numeric(10,2) NOT NULL, "ocorrencia" uuid, "operador" uuid, "equipamento" uuid, "ordem_producao" uuid, CONSTRAINT "PK_db9b22cb22b59872aec485c3011" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "tarefas" ADD CONSTRAINT "FK_1adc54f578d719bc3170ccffb44" FOREIGN KEY ("ocorrencia") REFERENCES "ocorrencias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "tarefas" ADD CONSTRAINT "FK_c2a76059272eea0f29233263ebe" FOREIGN KEY ("rotina_tarefas") REFERENCES "rotina_tarefas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "equipamentos" ADD CONSTRAINT "FK_a56d45d9d95e707c41b2290afa6" FOREIGN KEY ("rotina_tarefas") REFERENCES "rotina_tarefas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "apontamentos" ADD CONSTRAINT "FK_a0a3cb368fda80c8841987d30cb" FOREIGN KEY ("ocorrencia") REFERENCES "ocorrencias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "apontamentos" ADD CONSTRAINT "FK_5cad2eb37f9eaeac01a5f497fb8" FOREIGN KEY ("operador") REFERENCES "operadores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "apontamentos" ADD CONSTRAINT "FK_1f83eaf170d39377e7f0ea81c7c" FOREIGN KEY ("equipamento") REFERENCES "equipamentos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "apontamentos" ADD CONSTRAINT "FK_753d051dca01fdfc7bd639326e6" FOREIGN KEY ("ordem_producao") REFERENCES "ordens_producao"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "apontamentos" DROP CONSTRAINT "FK_753d051dca01fdfc7bd639326e6"`,
    )
    await queryRunner.query(
      `ALTER TABLE "apontamentos" DROP CONSTRAINT "FK_1f83eaf170d39377e7f0ea81c7c"`,
    )
    await queryRunner.query(
      `ALTER TABLE "apontamentos" DROP CONSTRAINT "FK_5cad2eb37f9eaeac01a5f497fb8"`,
    )
    await queryRunner.query(
      `ALTER TABLE "apontamentos" DROP CONSTRAINT "FK_a0a3cb368fda80c8841987d30cb"`,
    )
    await queryRunner.query(
      `ALTER TABLE "equipamentos" DROP CONSTRAINT "FK_a56d45d9d95e707c41b2290afa6"`,
    )
    await queryRunner.query(
      `ALTER TABLE "tarefas" DROP CONSTRAINT "FK_c2a76059272eea0f29233263ebe"`,
    )
    await queryRunner.query(
      `ALTER TABLE "tarefas" DROP CONSTRAINT "FK_1adc54f578d719bc3170ccffb44"`,
    )
    await queryRunner.query(`DROP TABLE "apontamentos"`)
    await queryRunner.query(`DROP TABLE "ordens_producao"`)
    await queryRunner.query(`DROP TABLE "operadores"`)
    await queryRunner.query(`DROP TABLE "equipamentos"`)
    await queryRunner.query(`DROP TABLE "rotina_tarefas"`)
    await queryRunner.query(`DROP TABLE "tarefas"`)
    await queryRunner.query(`DROP TABLE "ocorrencias"`)
  }
}
