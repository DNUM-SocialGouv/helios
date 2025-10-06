import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutTableRessourcesHumainesETSAN1758618772544 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                CREATE TABLE IF NOT EXISTS public.ressources_humaines_sanitaire(
                          numero_finess_etablissement_territorial varchar(9) not null references etablissement_territorial (numero_finess_etablissement_territorial) on delete cascade,
                          annee int4 not null,
                          nombre_etp_pm float8 null,
                          nombre_etp_pnm float8 null,
                          depenses_interim_pm float8 null,
                          jours_absenteisme_pm float8 null,
                          jours_absenteisme_pnm float8 null,
                          primary key (numero_finess_etablissement_territorial,annee)
                );
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS public.ressources_humaines_sanitaire;
        `);
  }

}
