import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutListEtEtsList1736865415982 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE user_list (
              list_id SERIAL PRIMARY KEY ,
              ut_id uuid NOT NULL,
              list_nom VARCHAR(255) NOT NULL,
              is_favori BOOLEAN DEFAULT false,
              date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (ut_id) REFERENCES utilisateur(ut_code) ON DELETE CASCADE
           )
          `);

    await queryRunner.query(`
            CREATE TABLE user_list_etablissement (
              list_id INT NOT NULL,
              numero_finess VARCHAR(9) NOT NULL,
              date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT user_list_etablissement_pk PRIMARY KEY (list_id, numero_finess)
            )
          `);
    await queryRunner.query(`
            INSERT into user_list(ut_id, list_nom, is_favori)
            select distinct user_id, 'Favoris', true from favori;
          `);
    await queryRunner.query(`
            INSERT into user_list_etablissement(list_id, numero_finess)
            select list_id, finess_number as numero_finess from favori
            left join user_list on user_list.ut_id = favori.user_id;
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user_list_etablissement`);
    await queryRunner.query(`DROP TABLE user_list`);
  }

}
