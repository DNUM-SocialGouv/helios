import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutLastPwdChangeDate1771324698360 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE utilisateur
            ADD COLUMN ut_last_pwd_change_date DATE;
            
          UPDATE utilisateur 
            SET ut_last_pwd_change_date = CURRENT_DATE
            WHERE ut_last_pwd_change_date IS NULL;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE utilisateur
        DROP COLUMN ut_last_pwd_change_date;`);
  }

}
