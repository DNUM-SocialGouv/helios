import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateUsersLastConnexionDate1704366840880 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        UPDATE public.utilisateur
        SET ut_date_last_connection= NOW()
        WHERE ut_date_last_connection IS NULL;
        `);
    }

    public async down(): Promise<void> {
    }

}
