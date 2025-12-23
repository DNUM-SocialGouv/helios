import { MigrationInterface, QueryRunner } from "typeorm";

export class SupprimeProfilSansLabel1765967970441 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Suppression des profils sans label ou avec label vide
    await queryRunner.query(`DELETE FROM profil WHERE profil_label IS NULL OR TRIM(profil_label) = ''`);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Cette migration supprime des données, il n'y a pas de restauration possible.
    return;
  }

}

