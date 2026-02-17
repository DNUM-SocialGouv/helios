import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutTauxOccupationGlobal1765980868528 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE activite_medico_social
      ADD taux_occupation_global FLOAT;

      UPDATE profil
        SET profil_value = jsonb_set(
            COALESCE(profil_value, '{}'::jsonb),
            '{autreRegion,profilMédicoSocial,activités}',
            COALESCE(profil_value->'autreRegion'->'profilMédicoSocial'->'activités', '{}'::jsonb) || jsonb_build_object(
                'tauxOccupationGlobal', 'no'
            ),
            true
        );

        UPDATE profil
        SET profil_value = jsonb_set(
            COALESCE(profil_value, '{}'::jsonb),
            '{institution,profilMédicoSocial,activités}',
            COALESCE(profil_value->'institution'->'profilMédicoSocial'->'activités', '{}'::jsonb) || jsonb_build_object(
                'tauxOccupationGlobal', 'ok'
            ),
            true
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE activite_medico_social
      DROP COLUMN taux_occupation_global;

      UPDATE profil
      SET profil_value = profil_value #- '{autreRegion,profilMédicoSocial,activités,tauxOccupationGlobal}';

      UPDATE profil
      SET profil_value = profil_value #- '{institution,profilMédicoSocial,activités,tauxOccupationGlobal}';

    `);
  }
}
