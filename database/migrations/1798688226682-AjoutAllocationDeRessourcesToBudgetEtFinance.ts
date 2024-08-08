import { MigrationInterface, QueryRunner } from "typeorm"

import { DefaultProfile } from "../../src/frontend/configuration/DefaultProfile";

export class AjoutAllocationDeRessourcesToBudgetEtFinance1798688226682 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`

        UPDATE profil
        SET profil_value = 
            CASE 
            WHEN jsonb_exists(profil_value, '{autreRegion,profilEJ,budgetEtFinance}') THEN
                jsonb_set(
                    profil_value,
                    '{autreRegion,profilEJ,budgetEtFinance,allocationDeRessources}',
                    '"ok"',
                    true
                )
            ELSE
                jsonb_set(
                    profil_value,
                    '{autreRegion,profilEJ,budgetEtFinance}',
                    jsonb_build_object(
                        'tauxDeCafNette', 'ok',
                        'compteRésultats', 'ok',
                        'résultatNetComptable', 'ok',
                        'ratioDépendanceFinancière', 'ok',
                        'allocationDeRessources', 'ok'
                    )
                )
            END;

            UPDATE profil
            SET profil_value = 
                CASE 
                WHEN jsonb_exists(profil_value, '{institution,profilEJ,budgetEtFinance}') THEN
                    jsonb_set(
                        profil_value,
                        '{institution,profilEJ,budgetEtFinance,allocationDeRessources}',
                        '"ok"',
                        true
                    )
                ELSE
                    jsonb_set(
                        profil_value,
                        '{institution,profilEJ,budgetEtFinance}',
                        jsonb_build_object(
                            'tauxDeCafNette', 'ok',
                            'compteRésultats', 'ok',
                            'résultatNetComptable', 'ok',
                            'ratioDépendanceFinancière', 'ok',
                            'allocationDeRessources', 'ok'
                        )
                    )
                END;



        UPDATE profil
        SET profil_value = 
            CASE 
            WHEN jsonb_exists(profil_value, '{autreRegion,profilETSanitaire,budgetEtFinance}') THEN
                jsonb_set(
                    profil_value,
                    '{autreRegion,profilETSanitaire,budgetEtFinance,allocationDeRessources}',
                    '"ok"',
                    true
                )
            ELSE
                jsonb_set(
                    profil_value,
                    '{autreRegion,profilETSanitaire,budgetEtFinance}',
                    jsonb_build_object(
                        'tauxDeCafNette', 'ok',
                        'compteRésultats', 'ok',
                        'résultatNetComptable', 'ok',
                        'ratioDépendanceFinancière', 'ok',
                        'allocationDeRessources', 'ok'
                    )
                )
            END;

            UPDATE profil
            SET profil_value = 
                CASE 
                WHEN jsonb_exists(profil_value, '{institution,profilETSanitaire,budgetEtFinance}') THEN
                    jsonb_set(
                        profil_value,
                        '{institution,profilETSanitaire,budgetEtFinance,allocationDeRessources}',
                        '"ok"',
                        true
                    )
                ELSE
                    jsonb_set(
                        profil_value,
                        '{institution,profilETSanitaire,budgetEtFinance}',
                        jsonb_build_object(
                            'tauxDeCafNette', 'ok',
                            'compteRésultats', 'ok',
                            'résultatNetComptable', 'ok',
                            'ratioDépendanceFinancière', 'ok',
                            'allocationDeRessources', 'ok'
                        )
                    )
                END;

        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        UPDATE profil
        SET profil_value = $1`, [DefaultProfile]);
    }

}
