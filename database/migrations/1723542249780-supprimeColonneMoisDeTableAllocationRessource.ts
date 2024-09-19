import { MigrationInterface, QueryRunner } from "typeorm"

export class SupprimeColonneMoisDeTableAllocationRessource1723542249780 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
           ALTER TABLE public.allocation_ressource_ej DROP COLUMN mois;
           ALTER TABLE public.allocation_ressource_et DROP COLUMN mois;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
           ALTER TABLE public.allocation_ressource_ej ADD COLUMN mois;
           ALTER TABLE public.allocation_ressource_et ADD COLUMN mois;
        `);
    }

}
