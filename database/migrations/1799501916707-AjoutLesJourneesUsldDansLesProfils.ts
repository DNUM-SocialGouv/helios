import { MigrationInterface, QueryRunner } from "typeorm";

import { DefaultProfile } from "../../src/frontend/configuration/DefaultProfile";

export class AjoutLesJourneesUsldDansLesProfils1799501916707 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`

        UPDATE profil
        SET profil_value = jsonb_set(
            COALESCE(profil_value, '{}'::jsonb), 
            '{autreRegion,profilETSanitaire,activités}', 
            COALESCE(profil_value->'autreRegion'->'profilETSanitaire'->'activités', '{}'::jsonb) || jsonb_build_object(
                'nombreJourneesUsld', 'ok'
            ),
            true
        );

        UPDATE profil
        SET profil_value = jsonb_set(
            COALESCE(profil_value, '{}'::jsonb), 
            '{institution,profilETSanitaire,activités}', 
            COALESCE(profil_value->'autreRegion'->'profilETSanitaire'->'activités', '{}'::jsonb) || jsonb_build_object(
                'nombreJourneesUsld', 'ok'
            ),
            true
        );

        UPDATE profil
        SET profil_value = jsonb_set(
            COALESCE(profil_value, '{}'::jsonb), 
            '{autreRegion,profilEJ,activités}', 
            COALESCE(profil_value->'autreRegion'->'profilEJ'->'activités', '{}'::jsonb) || jsonb_build_object(
                'nombreJourneesUsld', 'ok'
            ),
            true
        );

        UPDATE profil
        SET profil_value = jsonb_set(
            COALESCE(profil_value, '{}'::jsonb), 
            '{institution,profilEJ,activités}', 
            COALESCE(profil_value->'autreRegion'->'profilEJ'->'activités', '{}'::jsonb) || jsonb_build_object(
                'nombreJourneesUsld', 'ok'
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
