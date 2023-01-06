import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AjoutAnneeAutorisationSanitaire1673015716622 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('capacite_autorisation_sanitaire', new TableColumn({
      default: '2023',
      isNullable: false,
      name: 'annee',
      type: 'int',
    }))
    await queryRunner.query(`
        ALTER TABLE capacite_autorisation_sanitaire DROP CONSTRAINT capacite_autorisation_sanitaire_pkey;
        ALTER TABLE capacite_autorisation_sanitaire ADD PRIMARY KEY (annee, numero_finess_etablissement_territorial)
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE capacite_autorisation_sanitaire DROP CONSTRAINT capacite_autorisation_sanitaire_pkey;
        ALTER TABLE capacite_autorisation_sanitaire ADD PRIMARY KEY (numero_finess_etablissement_territorial)
    `)
    await queryRunner.dropColumn('capacite_autorisation_sanitaire', 'annee')
  }

}
