import { MigrationInterface, QueryRunner } from "typeorm";

export class ModificationValeurProfilAjoutBlocRhEj1758098318274 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE public.profil
        SET profil_value = jsonb_set(
          profil_value,
          '{institution,profilEJ,ressourcesHumaines}',
          jsonb_build_object(
            'nombreEtpPm',        'no',
            'nombreEtpPnm',       'no',
            'depensesInterimPm',  'no',
            'joursAbsenteismePm', 'no'
          ),
          true -- pour créer les conteneurs manquants 
        )
        WHERE (profil_value #> '{institution,profilEJ,ressourcesHumaines}') IS NULL;  
      `);
    await queryRunner.query(`
        UPDATE public.profil
        SET profil_value = jsonb_set(
          profil_value,
          '{autreRegion,profilEJ,ressourcesHumaines}',
          jsonb_build_object(
            'nombreEtpPm',        'no',
            'nombreEtpPnm',       'no',
            'depensesInterimPm',  'no',
            'joursAbsenteismePm', 'no'
          ),
          true -- pour créer les conteneurs manquants 
        )
        WHERE (profil_value #> '{autreRegion,profilEJ,ressourcesHumaines}') IS NULL;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE public.profil
        SET profil_value = profil_value #- '{institution,profilEJ,ressourcesHumaines}'
        WHERE profil_value #> '{institution,profilEJ,ressourcesHumaines}' IS NOT NULL;
    `);

    await queryRunner.query(`
        UPDATE public.profil
        SET profil_value = profil_value #- '{autreRegion,profilEJ,ressourcesHumaines}'
        WHERE profil_value #> '{autreRegion,profilEJ,ressourcesHumaines}' IS NOT NULL;
    `);
  }

}
