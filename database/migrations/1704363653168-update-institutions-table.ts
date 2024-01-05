import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInstitutionsTable1704363653168 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // create back-up r-------------------------------
    await queryRunner.query("create table IF NOT EXISTS utilisateur_old as select * from utilisateur;");
    await queryRunner.query("create table IF NOT EXISTS institution_old as select * from institution;");

    // attach users cat-amania to equipe projet (DNUM)
    await queryRunner.query(`UPDATE public.utilisateur
        SET ut_institution= (select inst_id from institution where inst_code_geo = '00')
        WHERE ut_institution= (select inst_id from institution where inst_code = 'CAT')`);

    // delete institution cat-amania
    await queryRunner.query("DELETE FROM public.institution WHERE inst_code = 'CAT'");

    // update institution DNUM ---> equipe projet
    await queryRunner.query("UPDATE institution SET inst_libelle= 'Equipe projet' WHERE inst_code_geo = '00'");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE utilisateur_old;`);
    await queryRunner.query(`DROP TABLE institution_old;`);
  }
}
