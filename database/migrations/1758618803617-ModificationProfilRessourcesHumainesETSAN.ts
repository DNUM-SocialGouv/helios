import { MigrationInterface, QueryRunner } from "typeorm";

export class ModificationProfilRessourcesHumainesETSAN1758618803617 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE public.profil
        SET profil_value = jsonb_set(
          profil_value,
          '{institution,profilETSanitaire,ressourcesHumaines}',
          jsonb_build_object(
            'nombreEtpPm',        'no',
            'nombreEtpPnm',       'no',
            'depensesInterimPm',  'no',
            'joursAbsenteismePm', 'no',
            'joursAbsenteismePnm', 'no'
          ),
          true -- pour créer les conteneurs manquants 
        )
        WHERE (profil_value #> '{institution,profilETSanitaire,ressourcesHumaines}') IS NULL;  
      `);
    await queryRunner.query(`
        UPDATE public.profil
        SET profil_value = jsonb_set(
          profil_value,
          '{autreRegion,profilETSanitaire,ressourcesHumaines}',
          jsonb_build_object(
            'nombreEtpPm',        'no',
            'nombreEtpPnm',       'no',
            'depensesInterimPm',  'no',
            'joursAbsenteismePm', 'no',
            'joursAbsenteismePnm', 'no'
          ),
          true -- pour créer les conteneurs manquants 
        )
        WHERE (profil_value #> '{autreRegion,profilETSanitaire,ressourcesHumaines}') IS NULL;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE public.profil
        SET profil_value = profil_value #- '{institution,profilETSanitaire,ressourcesHumaines}'
        WHERE profil_value #> '{institution,profilETSanitaire,ressourcesHumaines}' IS NOT NULL;
    `);

    await queryRunner.query(`
        UPDATE public.profil
        SET profil_value = profil_value #- '{autreRegion,profilETSanitaire,ressourcesHumaines}'
        WHERE profil_value #> '{autreRegion,profilETSanitaire,ressourcesHumaines}' IS NOT NULL;
    `);
  }
}
