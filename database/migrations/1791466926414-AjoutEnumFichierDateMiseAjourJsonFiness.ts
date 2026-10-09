import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutEnumFichierDateMiseAjourJsonFiness1791466926414 implements MigrationInterface {

   async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
                ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'finess_structure';
                ALTER TYPE fichier_source ADD VALUE IF NOT EXISTS 'finess_activite';
            `);
      }
    
      async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
                ALTER TYPE fichier_source DROP VALUE IF EXISTS 'finess_structure';
                ALTER TYPE fichier_source DROP VALUE IF EXISTS 'finess_activite';
            `);
      }

}
