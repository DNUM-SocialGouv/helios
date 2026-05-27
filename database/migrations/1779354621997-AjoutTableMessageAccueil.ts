import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutTableMessageAccueil1779354621997 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE message_accueil(
                id serial primary key,
                contenu text not null,
                date_debut date not null,
                date_fin date not null,
                badge_type varchar(50),
                badge_libelle varchar(255),
                date_creation timestamp not null default now(),
                is_affiche boolean not null default true
            );
        `);
  }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE message_accueil;
        `);
    }

}
