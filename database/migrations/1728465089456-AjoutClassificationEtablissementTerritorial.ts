import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutClassificationEtablissementTerritorial1728465089456 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE etablissement_territorial
            ADD COLUMN classification VARCHAR(50);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE etablissement_territorial
            DROP COLUMN classification;`);
    }

}
