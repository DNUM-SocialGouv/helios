import { MigrationInterface, QueryRunner } from "typeorm";

import { DefaultProfile } from "../../src/frontend/configuration/DefaultProfile";

export class ajoutTableProfil1695731844298 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS public.profil(
                profil_id bigserial NOT NULL,
                profil_code uuid NOT NULL default gen_random_uuid(),
                profil_label character varying(255) NOT NULL,
                profil_value jsonb NOT NULL,
                profil_date_creation timestamp,
                profil_date_modification timestamp,
                PRIMARY KEY (profil_id)
            );`);

    await queryRunner.query(`INSERT INTO public.profil(profil_label, profil_value, profil_date_creation) VALUES ($1, $2, $3)`, [
      "Utilisateur lambda",
      DefaultProfile,
      new Date(),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE public.profil;
        `);
  }
}
