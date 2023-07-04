import { MigrationInterface, QueryRunner } from "typeorm"

export class ModificationTableInstitution1688376404752 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
           ALTER TABLE public.institution DROP CONSTRAINT institution_inst_code_key
        `);
        await queryRunner.query(`
            ALTER TABLE public.institution RENAME COLUMN inst_code TO inst_code_geo;
        `);
        await queryRunner.query(`
            ALTER TABLE public.institution ADD COLUMN inst_code character varying(10);
        `);
        await queryRunner.query(`
            ALTER TABLE public.institution ADD CONSTRAINT inst_code_key UNIQUE(inst_code);
        `);

        await queryRunner.query(`
            ALTER TABLE public.institution ADD CONSTRAINT inst_code_geo_key UNIQUE(inst_code_geo);
        `);

        await queryRunner.query(`
            ALTER TABLE public.institution ALTER COLUMN inst_code_geo set NOT NULL;
        `);

        await queryRunner.query("update public.institution set inst_code=CONCAT ('ARS_',inst_code_geo);");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
           ALTER TABLE public.institution DROP CONSTRAINT inst_code_key
        `);

        await queryRunner.query(`
            ALTER TABLE public.institution DROP CONSTRAINT inst_code_geo_key;
         `);

        await queryRunner.query(`
           ALTER TABLE public.institution DROP COLUMN inst_code;
        `);

        await queryRunner.query(`
            ALTER TABLE public.institution RENAME COLUMN inst_code_geo TO inst_code;
        `);

        await queryRunner.query(`
            ALTER TABLE public.institution ADD CONSTRAINT institution_inst_code_key UNIQUE(inst_code);
         `);

        await queryRunner.query(`
            ALTER TABLE public.institution ALTER COLUMN inst_code set NOT NULL;
        `);
    }

}
