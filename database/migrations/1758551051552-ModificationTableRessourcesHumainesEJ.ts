import { MigrationInterface, QueryRunner } from "typeorm";

export class ModificationTableRessourcesHumainesEJ1758551051552 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        alter table public.ressources_humaines_entite_juridique 
          add if not exists jours_absenteisme_pnm float8 null;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await  queryRunner.query(`
        alter table public.ressources_humaines_entite_juridique 
          drop if exists jours_absenteisme_pnm;
        `);
    }

}
