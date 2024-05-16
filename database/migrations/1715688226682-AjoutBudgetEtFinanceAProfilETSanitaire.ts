import { MigrationInterface, QueryRunner } from "typeorm"

import { DefaultProfile } from "../../src/frontend/configuration/DefaultProfile";

export class AjoutBudgetEtFinanceAProfilETSanitaire1715688226682 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        UPDATE profil
        SET profil_value = 
        CASE 
        WHEN NOT jsonb_exists(profil_value, '{autreRegion,profilETSanitaire,budgetEtFinance}') THEN
            jsonb_set(
                profil_value,
                '{autreRegion,profilETSanitaire,budgetEtFinance}',
                jsonb_build_object(
                    'tauxDeCafNette', 'ok',
                    'compteRésultats', 'ok',
                    'résultatNetComptable', 'ok',
                    'ratioDépendanceFinancière', 'ok'
                )
            )
        ELSE
            profil_value
        END;

        UPDATE profil
        SET profil_value = 
        CASE 
        WHEN NOT jsonb_exists(profil_value, '{institution,profilETSanitaire,budgetEtFinance}') THEN
            jsonb_set(
                profil_value,
                '{institution,profilETSanitaire,budgetEtFinance}',
                jsonb_build_object(
                    'tauxDeCafNette', 'ok',
                    'compteRésultats', 'ok',
                    'résultatNetComptable', 'ok',
                    'ratioDépendanceFinancière', 'ok'
                )
            )
        ELSE
            profil_value
        END;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        UPDATE profil
        SET profil_value = $1`, [DefaultProfile]);
    }


}
