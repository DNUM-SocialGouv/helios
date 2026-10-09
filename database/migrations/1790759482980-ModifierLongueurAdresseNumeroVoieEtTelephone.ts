import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifierLongueurAdresseNumeroVoieEtTelephone1790759482980 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE entite_juridique
            ALTER COLUMN adresse_numero_voie TYPE varchar(20),
            ALTER COLUMN telephone TYPE varchar(255);
        `);

        await queryRunner.query(`
            ALTER TABLE etablissement_territorial
            ALTER COLUMN adresse_numero_voie TYPE varchar(20),
            ALTER COLUMN telephone TYPE varchar(255);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE entite_juridique
            ALTER COLUMN adresse_numero_voie TYPE varchar(5),
            ALTER COLUMN telephone TYPE varchar(10);
        `);

        await queryRunner.query(`
            ALTER TABLE etablissement_territorial
            ALTER COLUMN adresse_numero_voie TYPE varchar(5),
            ALTER COLUMN telephone TYPE varchar(10);
        `);
    }

}
