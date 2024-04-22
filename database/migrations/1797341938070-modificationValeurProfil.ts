import { MigrationInterface, QueryRunner } from "typeorm"

import { DefaultProfile } from "../../src/frontend/configuration/DefaultProfile";

export class ModificationValeurProfil1797341938070 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        UPDATE profil
        SET profil_value = 
        CASE 
        WHEN profil_value -> 'autreRegion' -> 'profilETSanitaire' -> 'Qualité' ->> 'missions' = 'ok' THEN
            jsonb_set(
                jsonb_set(
                    profil_value,
                    '{autreRegion,profilETSanitaire,Qualité}',
                    jsonb_build_object('DonnéesSirec', 'ok', 'DonnéesSivss', 'ok', 'DonnéesSiicea', 'ok')
                ),
                '{autreRegion,profilETSanitaire,Qualité,missions}',
                '"ok"'
            )
        ELSE
            jsonb_set(
                jsonb_set(
                    profil_value,
                    '{autreRegion,profilETSanitaire,Qualité}',
                    jsonb_build_object('DonnéesSirec', 'no', 'DonnéesSivss', 'no', 'DonnéesSiicea', 'no')
                ),
                '{autreRegion,profilETSanitaire,Qualité,missions}',
                '"no"'
            )
        END;
        UPDATE profil
        SET profil_value = 
        CASE 
        WHEN profil_value -> 'autreRegion' -> 'profilMédicoSocial' -> 'Qualité' ->> 'missions' = 'ok' THEN
            jsonb_set(
                jsonb_set(
                    profil_value,
                    '{autreRegion,profilMédicoSocial,Qualité}',
                    jsonb_build_object('DonnéesSirec', 'ok', 'DonnéesSivss', 'ok', 'DonnéesSiicea', 'ok')
                ),
                '{autreRegion,profilMédicoSocial,Qualité,missions}',
                '"ok"'
            )
        ELSE
            jsonb_set(
                jsonb_set(
                    profil_value,
                    '{autreRegion,profilMédicoSocial,Qualité}',
                    jsonb_build_object('DonnéesSirec', 'no', 'DonnéesSivss', 'no', 'DonnéesSiicea', 'no')
                ),
                '{autreRegion,profilMédicoSocial,Qualité,missions}',
                '"no"'
            )
        END;
        UPDATE profil
        SET profil_value = 
        CASE 
        WHEN profil_value -> 'institution' -> 'profilETSanitaire' -> 'Qualité' ->> 'missions' = 'ok' THEN
            jsonb_set(
                jsonb_set(
                    profil_value,
                    '{institution,profilETSanitaire,Qualité}',
                    jsonb_build_object('DonnéesSirec', 'ok', 'DonnéesSivss', 'ok', 'DonnéesSiicea', 'ok')
                ),
                '{institution,profilETSanitaire,Qualité,missions}',
                '"ok"'
            )
        ELSE
            jsonb_set(
                jsonb_set(
                    profil_value,
                    '{institution,profilETSanitaire,Qualité}',
                    jsonb_build_object('DonnéesSirec', 'no', 'DonnéesSivss', 'no', 'DonnéesSiicea', 'no')
                ),
                '{institution,profilETSanitaire,Qualité,missions}',
                '"no"'
            )
        END;
        UPDATE profil
        SET profil_value = 
        CASE 
        WHEN profil_value -> 'institution' -> 'profilMédicoSocial' -> 'Qualité' ->> 'missions' = 'ok' THEN
            jsonb_set(
                jsonb_set(
                    profil_value,
                    '{institution,profilMédicoSocial,Qualité}',
                    jsonb_build_object('DonnéesSirec', 'ok', 'DonnéesSivss', 'ok', 'DonnéesSiicea', 'ok')
                ),
                '{institution,profilMédicoSocial,Qualité,missions}',
                '"ok"'
            )
        ELSE
            jsonb_set(
                jsonb_set(
                    profil_value,
                    '{institution,profilMédicoSocial,Qualité}',
                    jsonb_build_object('DonnéesSirec', 'no', 'DonnéesSivss', 'no', 'DonnéesSiicea', 'no')
                ),
                '{institution,profilMédicoSocial,Qualité,missions}',
                '"no"'
            )
        END;
        UPDATE profil
        SET profil_value = profil_value #- '{autreRegion,profilETSanitaire,Qualité,missions}' #- '{autreRegion,profilMédicoSocial,Qualité,missions}' #- '{institution,profilETSanitaire,Qualité,missions}' #- '{institution,profilMédicoSocial,Qualité,missions}';
`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        UPDATE profil
        SET profil_value = $1`, [DefaultProfile]);
    }

}
