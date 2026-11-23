import { MigrationInterface, QueryRunner } from "typeorm";

export class EvolutionReferentielDepartementRegion1790841193934 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public.referentiel_departement_region
                ADD COLUMN ref_code_cog character varying(5),
                ADD COLUMN ref_libelle_commune character varying(255);
        `);

        await queryRunner.query(`
            ALTER TABLE public.referentiel_departement_region
                DROP CONSTRAINT referentiel_departement_region_ref_code_dep_key;
        `);

        await queryRunner.query(`
            CREATE UNIQUE INDEX referentiel_departement_region_ref_code_cog_key
                ON public.referentiel_departement_region(ref_code_cog)
                WHERE ref_code_cog IS NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX public.referentiel_departement_region_ref_code_cog_key;
        `);

        await queryRunner.query(`
            DELETE FROM public.referentiel_departement_region
            WHERE ref_id NOT IN (
                SELECT MIN(ref_id)
                FROM public.referentiel_departement_region
                GROUP BY ref_code_dep
            );
        `);

        await queryRunner.query(`
            ALTER TABLE public.referentiel_departement_region
                DROP COLUMN ref_libelle_commune,
                DROP COLUMN ref_code_cog;
        `);

        await queryRunner.query(`
            ALTER TABLE public.referentiel_departement_region
                ADD CONSTRAINT referentiel_departement_region_ref_code_dep_key UNIQUE (ref_code_dep);
        `);
    }
}
