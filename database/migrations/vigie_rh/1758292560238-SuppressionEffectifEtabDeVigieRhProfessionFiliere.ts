import { MigrationInterface, QueryRunner } from "typeorm";

export class SuppressionEffectifEtabDeVigieRhProfessionFiliere1758292560238 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE vigierh_profession_filiere DROP COLUMN effectif_etab;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE vigierh_profession_filiere ADD COLUMN effectif_etab INT NOT NULL;`);
    }

}
