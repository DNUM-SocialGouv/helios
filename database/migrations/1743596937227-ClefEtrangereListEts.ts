import { MigrationInterface, QueryRunner } from "typeorm";

export class ClefEtrangereListEts1743596937227 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM user_list_etablissement ule
            WHERE ule.list_id NOT IN (SELECT ul.list_id FROM user_list ul)
          `);

    await queryRunner.query(`
            ALTER TABLE IF EXISTS user_list_etablissement
              ADD CONSTRAINT user_list_etablissement_list_id_fkey FOREIGN KEY (list_id)
                REFERENCES user_list (list_id)
                ON DELETE CASCADE;
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user_list_etablissement DROP CONSTRAINT user_list_etablissement_list_id_fkey`);
  }

}
