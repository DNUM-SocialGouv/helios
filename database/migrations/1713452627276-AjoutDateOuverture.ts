import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutDateOuverture1713452627276 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(`
            ALTER TABLE entite_juridique
            ADD date_ouverture VARCHAR(11) NULL;
            `);

            await queryRunner.query(`
            ALTER TABLE etablissement_territorial
            ADD date_ouverture VARCHAR(11) NULL;
            `);

            await queryRunner.query(`
            ALTER TABLE equipement_materiel_lourd_sanitaire
            ADD date_ouverture VARCHAR(11) NULL;
            `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE entite_juridique
        DROP COLUMN date_ouverture;
        `);
        await queryRunner.query(`
        ALTER TABLE etablissement_territorial
        DROP COLUMN date_ouverture;
        `);
        await queryRunner.query(`
        ALTER TABLE equipement_materiel_lourd_sanitaire
        DROP COLUMN date_ouverture;
        `);
      }

}
