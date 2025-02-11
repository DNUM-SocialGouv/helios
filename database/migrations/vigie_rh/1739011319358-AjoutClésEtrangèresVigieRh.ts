import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutClésEtrangèresVigieRh1739011319358 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
        ALTER TABLE vigierh_contrat
        ADD CONSTRAINT fk_contrat_type_contrat
        FOREIGN KEY (type_contrat_code)
        REFERENCES vigierh_ref_type_contrat(code);

        ALTER TABLE vigierh_profession_filiere
        ADD CONSTRAINT fk_profession_filiere_profession
        FOREIGN KEY (profession_code)
        REFERENCES vigierh_ref_profession_filiere(code);

        ALTER TABLE vigierh_profession_groupe
        ADD CONSTRAINT fk_profession_groupe_profession
        FOREIGN KEY (profession_code)
        REFERENCES vigierh_ref_profession_groupe(code);

        ALTER TABLE vigierh_profession_groupe
        ADD CONSTRAINT fk_profession_groupe_qualite
        FOREIGN KEY (indic_qualite_effectif_code)
        REFERENCES vigierh_ref_qualite(code);
        
        ALTER TABLE vigierh_profession_groupe
        ADD CONSTRAINT fk_profession_groupe_redressement
        FOREIGN KEY (indic_redressement_effectif_code)
        REFERENCES vigierh_ref_redressement(code);
        
        ALTER TABLE vigierh_profession_groupe
        ADD CONSTRAINT fk_profession_groupe_masque
        FOREIGN KEY (indic_masque_secret_effectif_code)
        REFERENCES vigierh_ref_masque(code);
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
        ALTER TABLE vigierh_contrat
        DROP CONSTRAINT fk_contrat_type_contrat;

        ALTER TABLE vigierh_profession_filiere
        DROP CONSTRAINT fk_profession_filiere_profession;

        ALTER TABLE vigierh_profession_groupe
        DROP CONSTRAINT fk_profession_groupe_profession;
        
        ALTER TABLE vigierh_profession_groupe
        DROP CONSTRAINT fk_profession_groupe_qualite;
        
        ALTER TABLE vigierh_profession_groupe
        DROP CONSTRAINT fk_profession_groupe_redressement;
        
        ALTER TABLE vigierh_profession_groupe
        DROP CONSTRAINT fk_profession_groupe_masque;
      `);

    }

}
