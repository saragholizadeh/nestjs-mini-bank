import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialSchema1779892002980 implements MigrationInterface {
    name = 'CreateInitialSchema1779892002980'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "full_name" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "currencies" ("code" character varying(3) NOT NULL, "name" character varying NOT NULL, "decimal_places" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_9f8d0972aeeb5a2277e40332d29" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE TABLE "transfer_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from_account_id" uuid NOT NULL, "to_account_id" uuid NOT NULL, "amount" bigint NOT NULL, "currency_code" character varying(3) NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "job_id" character varying, "idempotency_key" character varying, "metadata" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), "completed_at" TIMESTAMP, CONSTRAINT "UQ_06194853027883cec28df01bada" UNIQUE ("idempotency_key"), CONSTRAINT "PK_179064b127046ace7cb891f48a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" uuid NOT NULL, "reference_id" uuid, "type" character varying NOT NULL, "amount" bigint NOT NULL, "currency_code" character varying(3) NOT NULL, "balance_before" bigint NOT NULL, "balance_after" bigint NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "idempotency_key" character varying, "metadata" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "UQ_11a02d187c87d3dc5b0b4949f20" UNIQUE ("idempotency_key"), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "account_number" character varying NOT NULL, "balance" bigint NOT NULL DEFAULT '0', "currency_code" character varying(3) NOT NULL DEFAULT 'USD', "status" character varying NOT NULL DEFAULT 'active', "metadata" jsonb, "deleted_at" TIMESTAMP, CONSTRAINT "UQ_ffd1ae96513bfb2c6eada0f7d31" UNIQUE ("account_number"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account_limits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "account_id" uuid NOT NULL, "limit_type" character varying NOT NULL, "amount" bigint NOT NULL, "period" character varying NOT NULL, CONSTRAINT "PK_5c570146f4736a92fd7942bc7df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying, "action" character varying NOT NULL, "entity_type" character varying, "entity_id" character varying, "before" jsonb, "after" jsonb, "ip_address" character varying, "user_agent" character varying, "result" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transfer_logs" ADD CONSTRAINT "FK_2a4d7d359c0975c74ba61dc2746" FOREIGN KEY ("from_account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfer_logs" ADD CONSTRAINT "FK_f8383d7cc392728f6d685d58321" FOREIGN KEY ("to_account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfer_logs" ADD CONSTRAINT "FK_88951083afa7913146cd336dea5" FOREIGN KEY ("currency_code") REFERENCES "currencies"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_49c0d6e8ba4bfb5582000d851f0" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_365b158cbdb7b7bc18bca4004af" FOREIGN KEY ("reference_id") REFERENCES "transfer_logs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_2f924e47919a97dc6168abda024" FOREIGN KEY ("currency_code") REFERENCES "currencies"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_a4cafed13e3ede137659efc9f76" FOREIGN KEY ("currency_code") REFERENCES "currencies"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_limits" ADD CONSTRAINT "FK_bb3dbf2e5793e0570d94fb911bd" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_limits" DROP CONSTRAINT "FK_bb3dbf2e5793e0570d94fb911bd"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_a4cafed13e3ede137659efc9f76"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_3000dad1da61b29953f07476324"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_2f924e47919a97dc6168abda024"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_365b158cbdb7b7bc18bca4004af"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_49c0d6e8ba4bfb5582000d851f0"`);
        await queryRunner.query(`ALTER TABLE "transfer_logs" DROP CONSTRAINT "FK_88951083afa7913146cd336dea5"`);
        await queryRunner.query(`ALTER TABLE "transfer_logs" DROP CONSTRAINT "FK_f8383d7cc392728f6d685d58321"`);
        await queryRunner.query(`ALTER TABLE "transfer_logs" DROP CONSTRAINT "FK_2a4d7d359c0975c74ba61dc2746"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TABLE "account_limits"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "transfer_logs"`);
        await queryRunner.query(`DROP TABLE "currencies"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
