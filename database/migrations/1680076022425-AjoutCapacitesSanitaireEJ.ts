import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutCapacitesSanitaireEJ1680076022425 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE capacite_autorisation_entite_juridique (
        annee INT NOT NULL,
        numero_finess_entite_juridique VARCHAR(9) NOT NULL,

        nombre_lits_chirurgie FLOAT,
        nombre_lits_médecine FLOAT,
        nombre_lits_obstétrique FLOAT,
        nombre_lits_ssr FLOAT,
        nombre_places_chirurgie FLOAT,
        nombre_places_médecine FLOAT,
        nombre_places_obstétrique FLOAT,
        nombre_places_ssr FLOAT,
        nombre_lits_usld FLOAT,
        nombre_lits_ou_places_psy_complet FLOAT,
        nombre_places_psy_partiel FLOAT,

        PRIMARY KEY (annee, numero_finess_entite_juridique),

        CONSTRAINT capacite_autorisation_entite_juridique_foreign_key 
         FOREIGN KEY (numero_finess_entite_juridique)
         REFERENCES entite_juridique(numero_finess_entite_juridique)
         ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE capacite_autorisation_entite_juridique;");
  }
}
