import { MigrationInterface, QueryRunner } from "typeorm";

export class ModificationProfilJoursAbsPnmRhEj1758555147382 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE public.profil
        SET profil_value = jsonb_set(
          profil_value,
          '{institution,profilEJ,ressourcesHumaines,joursAbsenteismePnm}',
          '"no"',
          true
        )
        WHERE profil_value #> '{institution,profilEJ,ressourcesHumaines,joursAbsenteismePnm}' IS NULL;
        `);

    await queryRunner.query(`
        UPDATE public.profil
        SET profil_value = jsonb_set(
          profil_value,
          '{autreRegion,profilEJ,ressourcesHumaines,joursAbsenteismePnm}',
          '"no"',
          true
        )
        WHERE profil_value #> '{autreRegion,profilEJ,ressourcesHumaines,joursAbsenteismePnm}' IS NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE public.profil
        SET profil_value = profil_value #- '{institution,profilEJ,ressourcesHumaines,joursAbsenteismePnm}'
        WHERE profil_value #> '{institution,profilEJ,ressourcesHumaines,joursAbsenteismePnm}' IS NOT NULL;
        `);

    await queryRunner.query(`
        UPDATE public.profil
        SET profil_value = profil_value #- '{autreRegion,profilEJ,ressourcesHumaines,joursAbsenteismePnm}'
        WHERE profil_value #> '{autreRegion,profilEJ,ressourcesHumaines,joursAbsenteismePnm}' IS NOT NULL;
        `);
  }

}
