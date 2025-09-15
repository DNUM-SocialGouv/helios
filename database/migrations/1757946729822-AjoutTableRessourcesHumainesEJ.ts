import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutTableRessourcesHumainesEJ1757946729822 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                CREATE TABLE public.ressources_humaines_entite_juridique(
                          numero_finess_entite_juridique varchar(9) not null references entite_juridique (numero_finess_entite_juridique),
                          annee int4 not null,
                          nombre_etp_pm float8 null,
                          nombre_etp_pnm float8 null,
                          depenses_interim_pm float8 null,
                          jours_absenteisme_pm float8 null,
                          primary key (numero_finess_entite_juridique,annee)
                );
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE public.ressources_humaines_entite_juridique;
        `);
  }

}
