import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutNombreJourneeUSLDActivitesSanitaires1745321952709 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE activite_sanitaire
            ADD nombre_journees_usld FLOAT;
        `);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE activite_sanitaire
            DROP COLUMN nombre_journees_usld;
        `);
    }

}
