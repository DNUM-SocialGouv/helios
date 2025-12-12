import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutColonneDepartsPrematuresCdi1761819265202 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE vigierh_mouvements ADD COLUMN IF NOT EXISTS departs_prematures_cdi int;");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE vigierh_mouvements DROP COLUMN IF EXISTS departs_prematures_cdi;");
    }

}
