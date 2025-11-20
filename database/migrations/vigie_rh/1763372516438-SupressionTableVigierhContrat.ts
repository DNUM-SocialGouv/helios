import { MigrationInterface, QueryRunner } from "typeorm";

export class SupressionTableVigierhContrat1763372516438 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS vigierh_contrat;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS vigierh_contrat (
                numero_finess VARCHAR(9) NOT NULL,
                annee INT NOT NULL,
                mois INT NOT NULL,
                type_contrat_code INT NOT NULL,
                effectif INT,
                PRIMARY KEY (numero_finess, annee, mois, type_contrat_code),
                CONSTRAINT fk_contrat_type_contrat FOREIGN KEY (type_contrat_code)
                REFERENCES vigierh_ref_type_contrat(code)
            );
        `);
    }

}
