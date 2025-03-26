import { MigrationInterface, QueryRunner } from "typeorm";

export class MettreAJourTableActiviteMedicoSocial1741861364859 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE activite_medico_social
            ADD taux_occupation_externat FLOAT,
            ADD taux_occupation_semi_internat FLOAT,
            ADD taux_occupation_internat FLOAT,
            ADD taux_occupation_autre FLOAT,
            ADD taux_occupation_seances FLOAT;
    `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE activite_medico_social
            DROP COLUMN taux_occupation_externat,
            DROP COLUMN taux_occupation_semi_internat,
            DROP COLUMN taux_occupation_internat,
            DROP COLUMN taux_occupation_autre,
            DROP COLUMN taux_occupation_seances;
    `)
    }

}
