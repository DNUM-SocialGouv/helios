import { MigrationInterface, QueryRunner } from "typeorm"

export class ajoutTableProfil1695731844298 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE public.profil(
                profil_id bigserial NOT NULL,
                profil_code uuid NOT NULL default gen_random_uuid(),
                profil_label character varying(255) NOT NULL,
                profil_value jsonb NOT NULL,
                profil_date_creation timestamp,
                profil_date_modification timestamp,
                PRIMARY KEY (profil_id)
            );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE public.profil;
        `);
    }

}
