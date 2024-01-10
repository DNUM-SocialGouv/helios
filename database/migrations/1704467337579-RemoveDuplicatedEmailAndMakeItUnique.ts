import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveDuplicatedEmailAndMakeItUnique1704467337579 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Backup
    await queryRunner.query("create table IF NOT EXISTS utilisateur_2_old as select * from utilisateur;");

    // Remove duplicated email
    await queryRunner.query(`
        DELETE from utilisateur where ut_id  not in
        (select ut_id from (select min(ut_id) as ut_id
                                from utilisateur group by ut_email ) as p)
        `);

    // Make email unique
    await queryRunner.query(`
        ALTER TABLE utilisateur 
        ADD CONSTRAINT uniqueEmail UNIQUE (ut_email);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    ALTER TABLE utilisateur 
    DROP CONSTRAINT uniqueEmail;
    `);
    await queryRunner.query(`DROP TABLE utilisateur_2_old;`);
  }
}
