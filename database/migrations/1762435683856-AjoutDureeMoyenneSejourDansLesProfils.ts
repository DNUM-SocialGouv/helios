import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutDureeMoyenneSejourDansLesProfils1762435683856 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE profil
        SET profil_value = 
            CASE 
            WHEN jsonb_exists(profil_value#>'{autreRegion,profilETSanitaire}', 'activités') THEN
                jsonb_set(
                    profil_value,
                    '{autreRegion,profilETSanitaire,activités,dureeMoyenneSejour}',
                    '"no"',
                    true
                )
            ELSE
                jsonb_set(
                    profil_value,
                    '{autreRegion,profilETSanitaire,activités}',
                    jsonb_build_object(
                        'nombrePassage', 'ok',
                        'nombreSéjours', 'ok',
                        'nombreJournées', 'ok',
                        'nombreJourneesUsld', 'ok',
                        'dureeMoyenneSejour', 'ok'
                    )
                )
            END;

        UPDATE profil
        SET profil_value = 
            CASE 
            WHEN jsonb_exists(profil_value#>'{institution,profilETSanitaire}', 'activités') THEN
                jsonb_set(
                    profil_value,
                    '{institution,profilETSanitaire,activités,dureeMoyenneSejour}',
                    '"no"',
                    true
                )
            ELSE
                jsonb_set(
                    profil_value,
                    '{institution,profilETSanitaire,activités}',
                    jsonb_build_object(
                        'nombrePassage', 'ok',
                        'nombreSéjours', 'ok',
                        'nombreJournées', 'ok',
                        'nombreJourneesUsld', 'ok',
                        'dureeMoyenneSejour', 'ok'
                    )
                )
            END;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE profil
        SET profil_value = profil_value #- '{autreRegion,profilETSanitaire,activités,dureeMoyenneSejour}';

        UPDATE profil
        SET profil_value = profil_value #- '{institution,profilETSanitaire,activités,dureeMoyenneSejour}';
    `);
  }

}
