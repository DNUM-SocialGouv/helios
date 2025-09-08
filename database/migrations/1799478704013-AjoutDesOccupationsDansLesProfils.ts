import { MigrationInterface, QueryRunner } from "typeorm";

import { DefaultProfile } from "../../src/frontend/configuration/DefaultProfile";

export class AjoutDesOccupationsDansLesProfils1799478704013 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`

        UPDATE profil
        SET profil_value = jsonb_set(
            COALESCE(profil_value, '{}'::jsonb), 
            '{autreRegion,profilMédicoSocial,activités}', 
            COALESCE(profil_value->'autreRegion'->'profilMédicoSocial'->'activités', '{}'::jsonb) || jsonb_build_object(
                'tauxOccupationExternat', 'no',
                'tauxOccupationSemiInternat', 'no',
                'tauxOccupationInternat', 'no',
                'tauxOccupationAutre', 'no',
                'tauxOccupationSeances', 'no'
            ),
            true
        );

        UPDATE profil
        SET profil_value = jsonb_set(
            COALESCE(profil_value, '{}'::jsonb), 
            '{institution,profilMédicoSocial,activités}', 
            COALESCE(profil_value->'institution'->'profilMédicoSocial'->'activités', '{}'::jsonb) || jsonb_build_object(
                'tauxOccupationExternat', 'ok',
                'tauxOccupationSemiInternat', 'ok',
                'tauxOccupationInternat', 'ok',
                'tauxOccupationAutre', 'ok',
                'tauxOccupationSeances', 'ok'
            ),
            true
        );

    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
    UPDATE profil
    SET profil_value = $1`, [DefaultProfile]);
    }

}
