import { MigrationInterface, QueryRunner } from 'typeorm'

export class TestDeGénération1666368499036 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE TestGeneration(
        id INTEGER PRIMARY KEY
      );`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE TestGeneration;')
  }

}
