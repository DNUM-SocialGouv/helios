import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutLesDonneesVigieRhDansLesProfils1788170804920 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
              await queryRunner.query(`

        UPDATE profil
        SET profil_value = jsonb_set(
            COALESCE(profil_value, '{}'::jsonb), 
            '{autreRegion,profilMédicoSocial,donneesVigieRh}', 
            COALESCE(profil_value->'autreRegion'->'profilMédicoSocial'->'donneesVigieRh', '{}'::jsonb) || jsonb_build_object(
                'pyramideDesAges', 'no',
                'evolutionDesEffectifs', 'no',
                'natureNouveauxContrats', 'no',
                'dureeEffectiveDesCDDTermines', 'no',
                'tauxRenouvellementEffectifs', 'no',
                'entreeSortie', 'no',
                'departsPrematureDesCDI', 'no',
                'motifsRuptureContrats', 'no'
            ),
            true
        );

        UPDATE profil
        SET profil_value = jsonb_set(
            COALESCE(profil_value, '{}'::jsonb), 
            '{institution,profilMédicoSocial,donneesVigieRh}', 
            COALESCE(profil_value->'institution'->'profilMédicoSocial'->'donneesVigieRh', '{}'::jsonb) || jsonb_build_object(
                 'pyramideDesAges', 'no',
                'evolutionDesEffectifs', 'no',
                'natureNouveauxContrats', 'no',
                'dureeEffectiveDesCDDTermines', 'no',
                'tauxRenouvellementEffectifs', 'no',
                'entreeSortie', 'no',
                'departsPrematureDesCDI', 'no',
                'motifsRuptureContrats', 'no'
            ),
            true
        );

    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      UPDATE profil
      SET profil_value = profil_value #- '{autreRegion,profilMédicoSocial,donneesVigieRh}';

      UPDATE profil
      SET profil_value = profil_value #- '{institution,profilMédicoSocial,donneesVigieRh}';

    `);
    }

}
