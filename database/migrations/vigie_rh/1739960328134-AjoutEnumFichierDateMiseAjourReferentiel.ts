import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutEnumFichierDateMiseAjourReferentiel1739960328134 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
                ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'vigierh_ref_nature_contrat';
                ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'vigierh_ref_profession1';
                ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'vigierh_ref_profession2';
                ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'vigierh_ref_masque';
                ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'vigierh_ref_qualite';
                ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'vigierh_ref_redressement';
            `);
      }
    
      async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("");
      }

}