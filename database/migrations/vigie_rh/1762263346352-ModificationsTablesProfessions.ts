import { MigrationInterface, QueryRunner } from "typeorm";

export class ModificationTableProfession21762263346352 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE vigierh_profession_groupe DROP COLUMN IF EXISTS effectif_filiere;`);
        await queryRunner.query(`ALTER TABLE vigierh_profession_groupe DROP COLUMN IF EXISTS quarter;`);
        await queryRunner.query(`ALTER TABLE vigierh_ref_profession_groupe ADD COLUMN IF NOT EXISTS code_filiere INT;`);
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.table_constraints
                    WHERE constraint_name = 'fk_vigierh_ref_profession_groupe_code_filiere'
                      AND table_name = 'vigierh_ref_profession_groupe'
                ) THEN
                    ALTER TABLE vigierh_ref_profession_groupe
                    ADD CONSTRAINT fk_vigierh_ref_profession_groupe_code_filiere
                    FOREIGN KEY (code_filiere)
                    REFERENCES vigierh_ref_profession_filiere(code)
                    ON DELETE SET NULL;
                END IF;
            END;
            $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1
                    FROM information_schema.table_constraints
                    WHERE constraint_name = 'fk_vigierh_ref_profession_groupe_code_filiere'
                      AND table_name = 'vigierh_ref_profession_groupe'
                ) THEN
                    ALTER TABLE vigierh_ref_profession_groupe
                    DROP CONSTRAINT fk_vigierh_ref_profession_groupe_code_filiere;
                END IF;
            END;
            $$;
        `);
        await queryRunner.query(`ALTER TABLE vigierh_ref_profession_groupe DROP COLUMN IF EXISTS code_filiere;`);
        await queryRunner.query(`ALTER TABLE vigierh_profession_groupe ADD COLUMN IF NOT EXISTS quarter INT;`);
        await queryRunner.query(`ALTER TABLE vigierh_profession_groupe ADD COLUMN IF NOT EXISTS effectif_filiere INT;`);
    }

}
