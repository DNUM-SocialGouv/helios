import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutLienHypertexteMessageAccueil1806000000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE message_accueil
            ADD COLUMN lien_url text,
            ADD COLUMN lien_libelle text;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE message_accueil
            DROP COLUMN lien_url,
            DROP COLUMN lien_libelle;
        `);
    }

}
