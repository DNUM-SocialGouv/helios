import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutProfilBesoinFondDeRoulement1773152515839 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE profil
        SET profil_value = jsonb_set(
            COALESCE(profil_value, '{}'::jsonb),
            '{autreRegion,profilEJ,budgetEtFinance}',
            COALESCE(profil_value->'autreRegion'->'profilEJ'->'budgetEtFinance', '{}'::jsonb) || jsonb_build_object(
                'besoinFondsDeRoulement', 'no'
            ),
            true
        );

        UPDATE profil
        SET profil_value = jsonb_set(
            COALESCE(profil_value, '{}'::jsonb),
            '{institution,profilEJ,budgetEtFinance}',
            COALESCE(profil_value->'institution'->'profilEJ'->'budgetEtFinance', '{}'::jsonb) || jsonb_build_object(
                'besoinFondsDeRoulement', 'no'
            ),
            true
        );

        UPDATE profil
        SET profil_value = jsonb_set(
            COALESCE(profil_value, '{}'::jsonb),
            '{autreRegion,profilETSanitaire,budgetEtFinance}',
            COALESCE(profil_value->'autreRegion'->'profilETSanitaire'->'budgetEtFinance', '{}'::jsonb) || jsonb_build_object(
                'besoinFondsDeRoulement', 'no'
            ),
            true
        );

        UPDATE profil
        SET profil_value = jsonb_set(
            COALESCE(profil_value, '{}'::jsonb),
            '{institution,profilETSanitaire,budgetEtFinance}',
            COALESCE(profil_value->'institution'->'profilETSanitaire'->'budgetEtFinance', '{}'::jsonb) || jsonb_build_object(
                'besoinFondsDeRoulement', 'no'
            ),
            true
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE profil
      SET profil_value = profil_value #- '{autreRegion,profilEJ,budgetEtFinance,besoinFondsDeRoulement}';

      UPDATE profil
      SET profil_value = profil_value #- '{institution,profilEJ,budgetEtFinance,besoinFondsDeRoulement}';

      UPDATE profil
      SET profil_value = profil_value #- '{autreRegion,profilETSanitaire,budgetEtFinance,besoinFondsDeRoulement}';

      UPDATE profil
      SET profil_value = profil_value #- '{institution,profilETSanitaire,budgetEtFinance,besoinFondsDeRoulement}';
    `);
  }

}
