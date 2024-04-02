import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutFichierSourceSirec1708679781472 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TYPE fichier_source
        ADD VALUE IF NOT EXISTS 'sirec';
        `)
    }

    public async down(): Promise<void> {
    }

}
