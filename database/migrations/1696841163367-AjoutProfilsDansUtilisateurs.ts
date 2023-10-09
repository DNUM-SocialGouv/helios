import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutProfilsDansUtilisateurs1696841163367 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE utilisateur
        ADD ut_profiles text[]`);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE utilisateur
        DROP COLUMN ut_profiles;`);
    }
}
