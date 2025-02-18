import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutReferentielTrancheAge1739874041081 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE referentiel_tranche_age_vigierh (
            code_tranche_age int NOT NULL,
            tranche_age varchar(255),
            creation_date DATE NOT NULL DEFAULT CURRENT_DATE,
            PRIMARY KEY (code_tranche_age)
          );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE IF EXISTS referentiel_tranche_age_vigierh;");
    }

}
