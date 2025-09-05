import * as fs from "fs";
import * as Papa from "papaparse";
import * as path from "path";
import { MigrationInterface, QueryRunner } from "typeorm";

interface ReferentielRow {
    'Code Activité': string;
    'Libellé Activité': string;
    'Code Modalité': string;
    'Libellé Modalité': string;
    'Code Mention': string;
    'Code Libellé': string;
    'Code Pratique Thérapeutique Spécifique': string;
    'Libellé Pratique Thérapeutique Spécifique': string;
    'Code Déclaration': string;
    'Libellé Déclaration': string;
}

export class AjoutNomenclatureAMM1755003914846 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const filePath = path.join(__dirname, "../../data_set/finess/Nomenclature-AMM-V14.csv");
        const fileContent = fs.readFileSync(filePath, "utf8");

        const { data } = Papa.parse<ReferentielRow>(fileContent, {
            header: true,
            skipEmptyLines: true
        });
        await queryRunner.query(`
            CREATE TABLE public.referentiel_nomenclature_amm(
                ref_amm_id BIGSERIAL PRIMARY KEY,
                code_activite character varying(5) NOT NULL,
                libelle_activite character varying(255) NOT NULL,
                code_modalite character varying(5) NOT NULL,
                libelle_modalite character varying(255) NOT NULL,
                code_mention character varying(5) NOT NULL,
                libelle_mention character varying(255) NOT NULL,
                code_pratique_therapeutique_specifique character varying(5) NOT NULL,
                libelle_pratique_therapeutique_specifique character varying(255) NOT NULL,
                code_declaration character varying(5) NOT NULL,
                libelle_declaration character varying(255) NOT NULL
            );`);
        for (const row of data) {
            await queryRunner.query(
                `INSERT INTO referentiel_nomenclature_amm(code_activite, libelle_activite, code_modalite, libelle_modalite, code_mention, libelle_mention, code_pratique_therapeutique_specifique, libelle_pratique_therapeutique_specifique, code_declaration, libelle_declaration)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [row['Code Activité'], row['Libellé Activité'], row['Code Modalité'], row['Libellé Modalité'], row['Code Mention'], row['Code Libellé'], row['Code Pratique Thérapeutique Spécifique'], row['Libellé Pratique Thérapeutique Spécifique'], row['Code Déclaration'], row['Libellé Déclaration']]
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE referentiel_nomenclature_amm;");
    }

}
