import { MigrationInterface, QueryRunner } from "typeorm"

export class AddCreatedByToProfileTable1706792910177 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE profil
        ADD COLUMN created_by INTEGER,
        ADD CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES utilisateur(ut_id);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE profil
            DROP COLUMN created_by;`);
    }
}
