import { MigrationInterface, QueryRunner } from 'typeorm'

export class V11750992938202 implements MigrationInterface {
  name = 'V11750992938202'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."tokens_type_enum" AS ENUM('PASSWORD_RECOVER')`,
    )
    await queryRunner.query(
      `CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."tokens_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user" uuid, "organization" uuid, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."users_user_type_enum" AS ENUM('MASTER', 'ORGANIZATIONAL')`,
    )
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "avatar_url" character varying(255), "user_type" "public"."users_user_type_enum" NOT NULL DEFAULT 'MASTER', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."members_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'MEMBER')`,
    )
    await queryRunner.query(
      `CREATE TABLE "members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."members_role_enum" NOT NULL DEFAULT 'MEMBER', "organization" uuid, "user" uuid, CONSTRAINT "UQ_df47247c38c8886b5554b200fc5" UNIQUE ("organization", "user"), CONSTRAINT "PK_28b53062261b996d9c99fa12404" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_MEMBER_ORGANIZATION" ON "members" ("organization") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_MEMBER_USER" ON "members" ("user") `,
    )
    await queryRunner.query(
      `CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "avatar_url" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "owner_id" uuid NOT NULL, "owner" uuid, CONSTRAINT "UQ_963693341bd612aa01ddf3a4b68" UNIQUE ("slug"), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ORGANIZATION_SLUG" ON "organizations" ("slug") `,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."accounts_provider_enum" AS ENUM('GITHUB')`,
    )
    await queryRunner.query(
      `CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" "public"."accounts_provider_enum" NOT NULL, "provider_account_id" character varying(255) NOT NULL, "user" uuid, "organization" uuid, CONSTRAINT "UQ_b0a347a4e389f28de99d982b103" UNIQUE ("provider_account_id"), CONSTRAINT "UQ_ed7dff6c8248e82bdefcb5a2399" UNIQUE ("provider", "user"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "settings" ("key" character varying(255) NOT NULL, "value" text NOT NULL, CONSTRAINT "PK_c8639b7626fa94ba8265628f214" PRIMARY KEY ("key"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_20a1c32e04c1bde78d3f277ba6e" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_f7590ebbd8aae91cdeeeab997c7" FOREIGN KEY ("organization") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" ADD CONSTRAINT "FK_6f279bf3408ad15292c6c36e20b" FOREIGN KEY ("organization") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" ADD CONSTRAINT "FK_b7a1659b22ee22309b422dafe65" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_4376bc59717cf541f86fb39dcc6" FOREIGN KEY ("owner") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_4fece97ff9cd4a96f56a412a528" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_e6e534cb2497f01045124fbc8f2" FOREIGN KEY ("organization") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "FK_e6e534cb2497f01045124fbc8f2"`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "FK_4fece97ff9cd4a96f56a412a528"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_4376bc59717cf541f86fb39dcc6"`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" DROP CONSTRAINT "FK_b7a1659b22ee22309b422dafe65"`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" DROP CONSTRAINT "FK_6f279bf3408ad15292c6c36e20b"`,
    )
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "FK_f7590ebbd8aae91cdeeeab997c7"`,
    )
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "FK_20a1c32e04c1bde78d3f277ba6e"`,
    )
    await queryRunner.query(`DROP TABLE "settings"`)
    await queryRunner.query(`DROP TABLE "accounts"`)
    await queryRunner.query(`DROP TYPE "public"."accounts_provider_enum"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_ORGANIZATION_SLUG"`)
    await queryRunner.query(`DROP TABLE "organizations"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_MEMBER_USER"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_MEMBER_ORGANIZATION"`)
    await queryRunner.query(`DROP TABLE "members"`)
    await queryRunner.query(`DROP TYPE "public"."members_role_enum"`)
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TYPE "public"."users_user_type_enum"`)
    await queryRunner.query(`DROP TABLE "tokens"`)
    await queryRunner.query(`DROP TYPE "public"."tokens_type_enum"`)
  }
}
