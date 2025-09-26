import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutEnumFichierDateMiseAjour1739804255435 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
                ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'vigierh_contrat';
                ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'vigierh_profession1';
                ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'vigierh_profession2';
            `);
      }
    
      async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("");
      }

}
