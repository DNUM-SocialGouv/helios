import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutHasAuProfilMedicoSocial1772196772012 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE profil
        SET profil_value = 
            CASE 
            WHEN jsonb_exists(profil_value#>'{autreRegion,profilMédicoSocial}', 'Qualité') THEN
                jsonb_set(
                    profil_value,
                    '{autreRegion,profilMédicoSocial,Qualité,DonnéesHas}',
                    '"no"',
                    true
                )
            ELSE
                jsonb_set(
                    profil_value,
                    '{autreRegion,profilMédicoSocial,Qualité}',
                    jsonb_build_object(
                        'DonnéesSirec', 'no',
                        'DonnéesSivss', 'no',
                        'DonnéesSiicea', 'no',
                        'DonnéesHas', 'no'                    )
                )
            END;

        UPDATE profil
        SET profil_value = 
            CASE 
            WHEN jsonb_exists(profil_value#>'{institution,profilMédicoSocial}', 'Qualité') THEN
                jsonb_set(
                    profil_value,
                    '{institution,profilMédicoSocial,Qualité,DonnéesHas}',
                    '"no"',
                    true
                )
            ELSE
                jsonb_set(
                    profil_value,
                    '{institution,profilMédicoSocial,Qualité}',
                    jsonb_build_object(
                        'DonnéesSirec', 'no',
                        'DonnéesSivss', 'no',
                        'DonnéesSiicea', 'no',
                        'DonnéesHas', 'no' 
                    )
                )
            END;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE profil
        SET profil_value = profil_value #- '{autreRegion,profilMédicoSocial,Qualité,DonnéesHas}';

        UPDATE profil
        SET profil_value = profil_value #- '{institution,profilMédicoSocial,Qualité,DonnéesHas}';
    `);
  }

}
